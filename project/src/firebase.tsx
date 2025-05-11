// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDFJfNH17K1RCWq4wJvRyk0m-gvFwm6Cnc",
    authDomain: "kawal-ptn-2a169.firebaseapp.com",
    projectId: "kawal-ptn-2a169",
    storageBucket: "kawal-ptn-2a169.firebasestorage.app",
    messagingSenderId: "355956247162",
    appId: "1:355956247162:web:86cc3a48e3fbade7ffc9c3",
    measurementId: "G-MBXDXZZPEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);