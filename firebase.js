const { getFirestore, collection, getDocs, addDoc} = require('firebase/firestore');
const firebase = require('firebase/app')
const config = require('./config')

const app = firebase.initializeApp(config.firebaseConfig);


const db = getFirestore(app);
module.exports = db;

// const { initializeApp } = require('firebase/app');
// const { getFirestore, collection, getDocs, addDoc} = require('firebase/firestore/lite');

// // Follow this pattern to import other Firebase services
// // import { } from 'firebase/<service>';

// // TODO: Replace the following with your app's Firebase project configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDLgp4xS1UV0TQNHloMikjTTuEMxhqn2hA",
//     authDomain: "homiefy-76ea9.firebaseapp.com",
//     databaseURL: "https://homiefy-76ea9-default-rtdb.firebaseio.com",
//     projectId: "homiefy-76ea9",
//     storageBucket: "homiefy-76ea9.appspot.com",
//     messagingSenderId: "961140973145",
//     appId: "1:961140973145:web:875d338631af73f1c25b48"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);


// module.exports = {db};

// Get a list of cities from your database
// async function getCities(db) {
//   // const citiesCol = collection(db, 'Users');
//   // const citySnapshot = await getDocs(citiesCol);
//   // const cityList = citySnapshot.docs.map(doc => console.log(doc.data())

//   const docRef = await addDoc(collection(db, "Users"),{"name":"baby","age":"1"})
//   console.log("Document written with ID: ", docRef.id)
  
//  // );
//   return docRef;
// }

// getCities(db)