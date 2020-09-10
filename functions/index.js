const functions = require("firebase-functions");
const app = require("express")();

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

//www.baseurl.com/api/(anyroute)
exports.api = functions.https.onRequest(app);
//comment ended
