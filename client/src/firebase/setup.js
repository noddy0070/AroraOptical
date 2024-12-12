// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNSXyLo-7Pszzt5Lou65K1s9ny_Hm_7Gk",
  authDomain: "aroraopticals-1.firebaseapp.com",
  projectId: "aroraopticals-1",
  storageBucket: "aroraopticals-1.firebasestorage.app",
  messagingSenderId: "171331351742",
  appId: "1:171331351742:web:2d233f17e70f8a45791aef",
  measurementId: "G-T67184YDL6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

