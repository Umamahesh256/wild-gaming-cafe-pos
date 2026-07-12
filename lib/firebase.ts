import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBUiW-5bOsov59ofHKfyf4L5BR7mDhteAo",
  authDomain: "wild-cafe-pos.firebaseapp.com",
  databaseURL: "https://wild-cafe-pos-default-rtdb.firebaseio.com",
  projectId: "wild-cafe-pos",
  storageBucket: "wild-cafe-pos.firebasestorage.app",
  messagingSenderId: "609951732729",
  appId: "1:609951732729:web:994eb83a8a848414b92328"
};

// Initialize Firebase (only if not already initialized to prevent Next.js hot-reload errors)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app);
