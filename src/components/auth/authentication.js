import * as firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCdBmybUsGudru6iQLPqDdB6B-AsGqYpU4",
  authDomain: "whatsapp-503fa.firebaseapp.com",
  databaseURL: "https://whatsapp-503fa.firebaseio.com",
  storageBucket: "whatsapp-503fa.appspot.com",
};

export const firebaseApp = firebase.initializeApp(config);

// This is where you access the database
// Make a reference to the global database of firebase
export const topicsRef = firebase.database().ref();
