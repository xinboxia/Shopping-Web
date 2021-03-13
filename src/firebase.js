// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBzqpOEgdzteBzr4ztFGOHAsilxCnH1C4s",
    authDomain: "challenge-9dae6.firebaseapp.com",
    databaseURL: "https://challenge-9dae6.firebaseio.com",
    projectId: "challenge-9dae6",
    storageBucket: "challenge-9dae6.appspot.com",
    messagingSenderId: "706942216562",
    appId: "1:706942216562:web:a145417f83ccf5b7b715eb",
    measurementId: "G-8WH4FGN309"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export {db, auth};