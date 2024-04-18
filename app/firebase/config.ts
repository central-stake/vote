import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGOZHgBttP9JRIUfIMOr7lK20b-RmIbsE",
    authDomain: "new-vote-be.firebaseapp.com",
    projectId: "new-vote-be",
    storageBucket: "https://new-vote-be-default-rtdb.europe-west1.firebasedatabase.app",
    messagingSenderId: "new-vote-be.appspot.com",
    dataBaseUrl: "443136024646",
    appId: "1:443136024646:web:29ed7d0ad46884f2696a47",
    measurementId: "G-4YC6VHL1DT",
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);

export { db }

export default app;