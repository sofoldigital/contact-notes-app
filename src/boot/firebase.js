import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";

const firebaseConfig = process.env.firebaseConfig;

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storageRef = firebase.storage().ref();
const storageTask = firebase.storage.TaskEvent;
const functions = firebase.app().functions();

export { auth, db, storageRef, storageTask, functions };
