import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBImwZucZ-OZUjlnzE4Tb6oBarIQKBOSh4",
  authDomain: "pluviagoalgaeroy.firebaseapp.com",
  projectId: "pluviagoalgaeroy",
  storageBucket: "pluviagoalgaeroy.firebasestorage.app",
  messagingSenderId: "946868620819",
  appId: "1:946868620819:web:8b6370f4c2417b8760b9e6",
  measurementId: "G-LP5YMCDXN3"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firestore
const db = getFirestore(app);

export { app, analytics, db }; 