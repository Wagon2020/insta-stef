import Firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
// import { seedDatabase } from "../seed";

const config = {
  apiKey: "AIzaSyDMpJjmVuo4cRQeqWsO117mOMgOQYNoFaI",
  authDomain: "insta-9e36e.firebaseapp.com",
  projectId: "insta-9e36e",
  storageBucket: "insta-9e36e.appspot.com",
  messagingSenderId: "90818636369",
  appId: "1:90818636369:web:d1f5a7d09a7b024ad76670",
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

// only run that once to seed database!
// seedDatabase(firebase);

export { firebase, FieldValue };
