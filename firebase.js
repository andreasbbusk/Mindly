// Generel Firebase opsætning og implementation lavet af Andreas

// Imported functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkZKsseF2bUmitynUetVaP38cvacPKp_8",
  authDomain: "mindly-8b8eb.firebaseapp.com",
  databaseURL: "https://mindly-8b8eb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mindly-8b8eb",
  storageBucket: "mindly-8b8eb.appspot.com",
  messagingSenderId: "522053773555",
  appId: "1:522053773555:web:91eecc5ad8bbe26454ef86",
  measurementId: "G-0HMTC83RY8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
