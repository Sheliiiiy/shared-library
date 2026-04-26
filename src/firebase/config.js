import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMKRWT3_hne2sOD_JfWs219JjHQY6gMes",
  authDomain: "shared-library-online.firebaseapp.com",
  projectId: "shared-library-online",
  storageBucket: "shared-library-online.firebasestorage.app",
  messagingSenderId: "455670420993",
  appId: "1:455670420993:web:6ac8b7cdd5203335969200",
  measurementId: "G-XFV7RVBMT3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

