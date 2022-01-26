import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDeUM09g2pPgHkO0NCX6dIEMxE3ktCSEgk",
  authDomain: "wykop-counter.firebaseapp.com",
  projectId: "wykop-counter",
  storageBucket: "wykop-counter.appspot.com",
  messagingSenderId: "475747712154",
  appId: "1:475747712154:web:6069564ae2037c24257323"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore()
