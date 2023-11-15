// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API}`,
  authDomain: "notevault-5a01f.firebaseapp.com",
  projectId: "notevault-5a01f",
  storageBucket: "notevault-5a01f.appspot.com",
  messagingSenderId: "106018963382",
  appId: "1:106018963382:web:976449daf875c4a4de0b17"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);