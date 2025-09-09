// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 👈 add Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8sz0G5PntqfOoD_QblA94tnHkx7FWD30",
  authDomain: "financesystem-c5f03.firebaseapp.com",
  projectId: "financesystem-c5f03",
  storageBucket: "financesystem-c5f03.firebasestorage.app",
  messagingSenderId: "938656424927",
  appId: "1:938656424927:web:78e234d008b1a66e905a6a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);
