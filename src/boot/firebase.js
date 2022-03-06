import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDz9U5vCkcQaOFn9XpMxrrttPnGVCZ3eZ4",
  authDomain: "contact-notes-app.firebaseapp.com",
  projectId: "contact-notes-app",
  storageBucket: "contact-notes-app.appspot.com",
  messagingSenderId: "16126267907",
  appId: "1:16126267907:web:fa5e44d93e81a568a0f436",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storageRef = firebase.storage().ref();
const storageTask = firebase.storage.TaskEvent;
const functions = firebase.app().functions("australia-southeast1");

export { auth, db, storageRef, storageTask, functions };
