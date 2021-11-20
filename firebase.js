var admin = require("firebase-admin");
const firebase = require('firebase/app')
const config = require('./config')


var serviceAccount = require("./serviceAccountKey.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://homiefy-76ea9-default-rtdb.firebaseio.com",
  storageBucket: 'homiefy-76ea9.appspot.com'
});

const app = firebase.initializeApp(config.firebaseConfig);



const db = admin.firestore();
const storage = admin.storage().bucket('gs://homiefy-76ea9.appspot.com');
module.exports = {db , storage};



