// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-9svgg6X7XZHZksy5ybMD5eIRtHjlDyw",
  authDomain: "agora-dialer.firebaseapp.com",
  projectId: "agora-dialer",
  storageBucket: "agora-dialer.firebasestorage.app",
  messagingSenderId: "527317394743",
  appId: "1:527317394743:web:a4f368c2d453cc5db666b2",
  measurementId: "G-SYTS900DFY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const fireStore = getFirestore(app,"task-manager");
// const analytics = getAnalytics(app);
