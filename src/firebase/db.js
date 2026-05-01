import { doc, getDoc, setDoc, onSnapshot, enableIndexedDbPersistence } from "firebase/firestore";
import { db } from "./config.js";

const LIBRARY_DOC = doc(db, "library", "shared");

const defaultData = {
  users: ["GG", "VK"],
  userPasswords: {},
  books: []
};

// Enable offline persistence for better reliability
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("[Firebase] Persistence failed: multiple tabs open");
  } else if (err.code === "unimplemented") {
    console.warn("[Firebase] Persistence not supported in this browser");
  } else {
    console.error("[Firebase] Persistence error:", err);
  }
});

export async function getLibrary() {
  try {
    const snap = await getDoc(LIBRARY_DOC);
    if (snap.exists()) {
      return snap.data();
    }
    await setDoc(LIBRARY_DOC, defaultData);
    return defaultData;
  } catch (err) {
    console.error("[Firebase] getLibrary error:", err);
    throw err;
  }
}

export function subscribeToLibrary(callback, onError) {
  return onSnapshot(
    LIBRARY_DOC,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data());
      } else {
        setDoc(LIBRARY_DOC, defaultData)
          .then(() => callback(defaultData))
          .catch((err) => {
            console.error("[Firebase] create doc error:", err);
            if (onError) onError(err);
          });
      }
    },
    (err) => {
      console.error("[Firebase] onSnapshot error:", err);
      if (onError) onError(err);
    }
  );
}

export async function updateLibrary(data) {
  try {
    await setDoc(LIBRARY_DOC, data);
  } catch (err) {
    console.error("[Firebase] updateLibrary error:", err);
    throw err;
  }
}

