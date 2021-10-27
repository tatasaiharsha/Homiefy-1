const { getFirestore} = require('firebase/firestore');
const { getStorage} = require('firebase/storage');
const firebase = require('firebase/app')
const config = require('./config')

const app = firebase.initializeApp(config.firebaseConfig);


const db = getFirestore(app);
const storage = getStorage(app);
module.exports = {db,storage};