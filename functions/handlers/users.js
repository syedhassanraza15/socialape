const { db, admin } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../util/validators');

//signup user
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  //TODO: validate data
  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  const blankAvatar = 'blank-avatar.png'

  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: "This handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      //let imageFileName;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/blank-avatar.png?alt=media`, 
        //`https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/socialApeDP-${imageFileName}?alt=media`,
        userId,
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ error: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
}

//login user
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  //validate inputs
  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res
          .status(401)
          .json({ general: "Wrong credentials, please try again" });
      } else return res.status(500).json({ error: err.code });
    });
}

//Upload a profile image for user
exports.uploadImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    // console.log(fieldname);
    // console.log(filename);
    // console.log(mimetype);

    if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
      return res.status('400').json({ error: 'Wrong file type submitted.' });
    }

    //my.image.png
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    //now create a random number and round it to ignore decimal points 2313213213.png
    imageFileName = `socialApeDP-${Math.round(Math.random() * 10000000000)}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype }; //Destructuring
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin.storage().bucket().upload(imageToBeUploaded.filepath, {
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype
        }
      }
    })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: 'Image uploaded successfully' });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
}

//Add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`).update(userDetails)
    .then(() => {
      return res.json({ message: "Details added successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}
//get own user details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      //return res.json(userData);
      return db.collection('notifications').where('recipient', '==', req.user.handle)
        .orderBy('createdAt', 'desc').limit(10).get();
    })
    .then(data => {
      userData.notifications = [];
      data.forEach(doc => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          screamId: doc.data().screamId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id
        });
      });
      return res.json(userData)
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}