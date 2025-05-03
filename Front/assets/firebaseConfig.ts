// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your config from Firebase Console here:
const firebaseConfig = {
  apiKey: "AIzaSyBegj0erRon6BYOAwff8uT2OU_0UnclW9I",
  authDomain: "yourart-4e376.firebaseapp.com",
  projectId: "yourart-4e376",
  storageBucket: "yourart-4e376.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234" 
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
