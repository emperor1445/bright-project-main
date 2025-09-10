import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // 👈 add Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAZtE01ZmUtVyd9s51KwxxDPzcnRJFhDJE",
  authDomain: "finance-603f8.firebaseapp.com",
  projectId: "finance-603f8",
  storageBucket: "finance-603f8.firebasestorage.app",
  messagingSenderId: "211886810435",
  appId: "1:211886810435:web:4845c13ef2f22860d9fbf6",
  measurementId: "G-1N56ECQ6XF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);