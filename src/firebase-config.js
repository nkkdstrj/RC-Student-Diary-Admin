import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken } from 'firebase/messaging';
import { getStorage } from "firebase/storage";
// import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import * as admin from 'firebase-admin'
// import credentials from './credentials.json'

const firebaseConfig = {
  // apiKey: "AIzaSyBogZEBQvvIsqIr7AEXnAQMQVgp_0VFG5s",
  // authDomain: "capsdemo-f0a0d.firebaseapp.com",
  // databaseURL: "https://capsdemo-f0a0d-default-rtdb.asia-southeast1.firebasedatabase.app",
  // projectId: "capsdemo-f0a0d",
  // storageBucket: "capsdemo-f0a0d.appspot.com",
  // messagingSenderId: "471432509021",
  // appId: "1:471432509021:web:0b46067b0a0e96a056bfb4"
  
  // apiKey: "AIzaSyDftFDvyaJhK0ACRQT9nG5rSvQE5hxKdb0",
  //           authDomain: "mobilebasewebsite-b665d.firebaseapp.com",
  //           databaseURL: "https://mobilebasewebsite-b665d-default-rtdb.asia-southeast1.firebasedatabase.app",
  //           projectId: "mobilebasewebsite-b665d",
  //           storageBucket: "mobilebasewebsite-b665d.appspot.com",
  //           messagingSenderId: "678726832969",
  //           appId: "1:678726832969:web:f83fbe3965e060464a8098"
  //
    apiKey: "AIzaSyBflrryVTjLgjTOmWCxRZTor1j8qI_I_u0",
    authDomain: "rc-student-diary-5cad7.firebaseapp.com",
    databaseURL: "https://rc-student-diary-5cad7-default-rtdb.firebaseio.com",
    projectId: "rc-student-diary-5cad7",
    storageBucket: "rc-student-diary-5cad7.appspot.com",
    messagingSenderId: "257576196101",
    appId: "1:257576196101:web:2c31886018865408c5646c",
    measurementId: "G-EYCV84JMGN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// const { initializeApp } = require('firebase-admin/app');

// admin.initializeApp({
//   credential: admin.credential.cert(credentials),
//   databaseURL: "https://mobilebasewebsite-b665d-default-rtdb.asia-southeast1.firebasedatabase.app"
// });


// const messaging = firebase.messaging();
// const database = firebase.database();
// const db = getDatabase(app);
export const dbs = getFirestore(app);
export const db = getDatabase(app);
export { app, auth, getMessaging, getToken, onAuthStateChanged, storage };
// export { storage };
// export const messaging = getMessaging(app);
// export const database = getDatabase(app);