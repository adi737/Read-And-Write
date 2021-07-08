import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCPqAMnLgnVU6jsi0gmB76FfdIcaEzkwz4",
  authDomain: "read-and-write-images.firebaseapp.com",
  databaseURL: "https://read-and-write-images.firebaseio.com",
  projectId: "read-and-write-images",
  storageBucket: "read-and-write-images.appspot.com",
  messagingSenderId: "564695061737",
  appId: "1:564695061737:web:67054c08fcdb26f95fcc78"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();