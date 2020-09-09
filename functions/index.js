const functions = require("firebase-functions");
const app = require("express")();

const { getAllScreams, postOneScream } = require("./handlers/screams");

//const firebase = require("firebase");
//const e = require("express");
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require("./handlers/users"); //("./handlers/users");
//firebase.initializeApp(firebaseConfig);

const middleWareAuthentication = require("./util/middleWareAuthentication");

//All Routes
//Screams GET route
app.get("/screams", getAllScreams);
//POST one scream
//later on adding middleware authentication as a 2nd argument in ".post('route', 2nd argument, (req,res))" for ...
app.post("/scream", middleWareAuthentication, postOneScream);

//Sign Up route
app.post("/signup", signup);
//Login route
app.post("/login", login);

//image upload route
app.post("/user/image", middleWareAuthentication, uploadImage);

//user details route
app.post("/user", middleWareAuthentication, addUserDetails);

app.get('/user', middleWareAuthentication, getAuthenticatedUser);

//www.baseurl.com/api/screams
exports.api = functions.https.onRequest(app); 
//comment ended
