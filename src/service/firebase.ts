import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDYXFPtlAVzUPuDkREe9sc934Nlc_xIKyc",
  authDomain: "infourbi-8df9c.firebaseapp.com",
  projectId: "infourbi-8df9c",
  storageBucket: "infourbi-8df9c.firebasestorage.app",
  messagingSenderId: "335432407522",
  appId: "1:335432407522:web:8b0d021300ee6dfa6341bb",
  measurementId: "G-V2M81C2R0F"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);