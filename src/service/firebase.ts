// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9jP9Zkl6mAoH7K48JaANnftG0Q1mIqcE",
  authDomain: "infourbi-b04de.firebaseapp.com",
  projectId: "infourbi-b04de",
  storageBucket: "infourbi-b04de.firebasestorage.app",
  messagingSenderId: "467109582483",
  appId: "1:467109582483:web:e911ca7ccab32b85831f66",
  measurementId: "G-Q3BMVG87XL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);