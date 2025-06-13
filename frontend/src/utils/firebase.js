// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Impor untuk autentikasi

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4RNYPEOIHfwvQBbZBqkVkHMvvMXbGRz0",
  authDomain: "calmspace-c98b2.firebaseapp.com",
  projectId: "calmspace-c98b2",
  storageBucket: "calmspace-c98b2.firebasestorage.app",
  messagingSenderId: "909864388603",
  appId: "1:909864388603:web:cb651522550e74422d2d5e",
  measurementId: "G-TEXDVBPD05",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Inisialisasi autentikasi

export { app, auth, analytics };
