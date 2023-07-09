// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { config } from '../config'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBdkpPi83nmWXhMH18ZBGyo7mowVHgFbsA",
    authDomain: "sociallstic.firebaseapp.com",
    projectId: "sociallstic",
    storageBucket: "sociallstic.appspot.com",
    messagingSenderId: "1052750658508",
    appId: "1:1052750658508:web:82c83095bca1ae0dd7bb69",
    measurementId: "G-PGRPH4YC2Z"
  };

// Initialize Firebase
const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

