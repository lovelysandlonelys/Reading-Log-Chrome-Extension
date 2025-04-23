// firebase.js
// filepath: c:\Users\steph\Dev\Reading-Log-Chrome-Extension\src\scripts\firebase.js
import { initializeApp } from "./firebase-app.js"; // Local file
import { getAuth, setPersistence, browserLocalPersistence, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "./firebase-auth.js"; // Local file

const firebaseConfig = {
  apiKey: "AIzaSyCOpGI0AUqLMJfjbzqPwIKWuItiIR57El8",
  authDomain: "reading-log-chrome-extension.firebaseapp.com",
  projectId: "reading-log-chrome-extension",
  storageBucket: "reading-log-chrome-extension.firebasestorage.app",
  messagingSenderId: "183603389063",
  appId: "1:183603389063:web:d33467ec73c575c786ce22",
  measurementId: "G-XNQMQ4M90S"
};
const BASE_FIRESTORE_URL = "https://firestore.googleapis.com/v1/projects/reading-log-chrome-extension/databases/(default)/documents";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence to local before any authentication actions
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Authentication persistence set to local.");
  })
  .catch((error) => {
    console.error("Error setting authentication persistence:", error);
  });

export { auth, getAuth };

export async function saveLogToFirestore(logData) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Define the Firestore URL for saving logs
  const url = `${BASE_FIRESTORE_URL}/logs`;

  // Construct the body with all fields, including the user's UID and timestamp
  const body = {
    fields: {
      uid: { stringValue: user.uid }, // Associate log with the user's UID
      title: { stringValue: logData.title || "(No Title)" },
      author: { stringValue: logData.author || "(No Author)" },
      link: { stringValue: logData.link || "#" },
      genre: { stringValue: logData.genre || "Unknown" },
      form: { stringValue: logData.form || "Unknown" },
      wordsRead: { integerValue: logData.wordsRead || 0 },
      rating: { integerValue: logData.rating || 0 },
      notes: { stringValue: logData.notes || "" },
      timestamp: { timestampValue: new Date().toISOString() }, // Add a timestamp
    },
  };

  // Send the POST request to Firestore
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to save log: ${response.statusText}`);
  }

  console.log("✅ Log saved successfully:", await response.json());
}

export async function getLogsFromFirestore() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const url = `https://firestore.googleapis.com/v1/projects/reading-log-chrome-extension/databases/(default)/documents:runQuery`;

  const body = {
    structuredQuery: {
      from: [{ collectionId: "logs" }],
      where: {
        fieldFilter: {
          field: { fieldPath: "uid" },
          op: "EQUAL",
          value: { stringValue: user.uid },
        },
      },
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.statusText}`);
  }

  const data = await response.json();
  return data
    .filter((doc) => doc.document) // Filter out non-document results
    .map((doc) => doc.document); // Extract the document data
}

// 🚮 Delete a log
export async function deleteLogFromFirestore(logId) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const url = `${BASE_FIRESTORE_URL}/logs/${logId}`;

  console.log(`🗑️ Deleting log at URL: ${url}`);

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete log: ${response.statusText}`);
  }

  console.log(`✅ Log with ID "${logId}" deleted from Firestore.`);
}