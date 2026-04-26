import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./config.js";

const LIBRARY_DOC = doc(db, "library", "shared");

const defaultData = {
  users: ["GG", "VK"],
  books: []
};

export async function getLibrary() {
  const snap = await getDoc(LIBRARY_DOC);
  if (snap.exists()) {
    return snap.data();
  }
  await setDoc(LIBRARY_DOC, defaultData);
  return defaultData;
}

export function subscribeToLibrary(callback) {
  return onSnapshot(LIBRARY_DOC, (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    } else {
      setDoc(LIBRARY_DOC, defaultData);
      callback(defaultData);
    }
  });
}

export async function updateLibrary(data) {
  await setDoc(LIBRARY_DOC, data);
}

