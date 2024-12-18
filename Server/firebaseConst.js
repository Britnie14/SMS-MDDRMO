import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDs4c6-R3u7yzm_dl5rzQJ1_Xkk5kTvuqg",
    authDomain: "sms-response-58493.firebaseapp.com",
    projectId: "sms-response-58493",
    storageBucket: "sms-response-58493.appspot.com",
    messagingSenderId: "534301049498",
    appId: "1:534301049498:web:f82132e65d659e516f1523"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app); // Firestore
export const auth = getAuth(app);    // Authentication
export const storage = getStorage(app); // Cloud Storage
export const firebaseApp = app;      // Firebase App instance (optional for advanced use)
