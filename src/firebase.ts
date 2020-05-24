import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";

firebase.initializeApp({
  projectId: "wordsearch-172001",
  appId: "1:686396208177:web:5119a766dc890b7d671110",
  databaseURL: "https://wordsearch-172001.firebaseio.com",
  storageBucket: "wordsearch-172001.appspot.com",
  locationId: "us-central",
  apiKey: "AIzaSyDdP3NKexxOoZ3DYZwsObJsPIgmyxNiFno",
  authDomain: "wordsearch-172001.firebaseapp.com",
  messagingSenderId: "686396208177",
  measurementId: "G-VDB5Y63TWR",
});

export const analyticsThunk = () => firebase.analytics();

export const firestore = firebase.firestore();
