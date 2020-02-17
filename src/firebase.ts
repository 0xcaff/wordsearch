import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDVyydEEzAXaSJxVj3Aj583d5rcNDdSpLI",
  authDomain: "wordsearch-172001.firebaseapp.com",
  databaseURL: "https://wordsearch-172001.firebaseio.com",
  projectId: "wordsearch-172001",
  storageBucket: "wordsearch-172001.appspot.com",
  messagingSenderId: "686396208177"
});

export const firestore = firebase.firestore();
