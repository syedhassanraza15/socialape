const functions = require("firebase-functions");
const app = require("express")();

const { db } = require('./util/admin');

const { getAllScreams, postOneScream, getScream, commentOnScream, likeScream, unLikeScream, deleteScream } = require("./handlers/screams");

//const firebase = require("firebase");
//const e = require("express");
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require("./handlers/users"); //("./handlers/users");
//firebase.initializeApp(firebaseConfig);

const middleWareAuthentication = require("./util/middleWareAuthentication");

//All Routes

//Screams routes
app.get("/screams", getAllScreams);
//POST one scream
//later on adding middleware authentication as a 2nd argument in ".post('route', 2nd argument, (req,res))" for ...
app.post("/scream", middleWareAuthentication, postOneScream);

//image upload route
app.post("/user/image", middleWareAuthentication, uploadImage);

//user details route
app.post("/user", middleWareAuthentication, addUserDetails);

app.get('/user', middleWareAuthentication, getAuthenticatedUser);

//
app.get('/scream/:screamId', getScream);

//delete scream
app.delete('/scream/:screamId', middleWareAuthentication, deleteScream);

//like a scream
app.get('/scream/:screamId/like', middleWareAuthentication, likeScream);

//unlike a scream
app.get('/scream/:screamId/unlike', middleWareAuthentication, unLikeScream);
//comment on scream
app.post('/scream/:screamId/comment', middleWareAuthentication, commentOnScream);

//User routes Signup and Login
app.post("/signup", signup);
app.post("/login", login);

//creating notification on like
exports.createNotificationOnLike = functions.region('europe-west1').firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .then(() => {
                return;
            })
            .catch((err) => {
                console.error(err);
                return;
            })
    })

//delete the notification on unlike
exports.deleteNotificationOnUnlike = functions
    .region('europe-west1').firestore.document('likes/{id}')
    .onDelete((snapshot) => {
        db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .then(() => {
                return;
            })
            .catch(err => {
                console.error(err);
                return;
            })
    })

//creating notification on comment
exports.createNotificationOnComment = functions.region('europe-west1').firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .then(() => {
                return;
            })
            .catch((err) => {
                console.error(err);
                return;
            })
    })

//www.baseurl.com/api/(anyroute)
exports.api = functions.region('europe-west1').https.onRequest(app); //exports.api = functions.https.onRequest(app);
//comment ended
