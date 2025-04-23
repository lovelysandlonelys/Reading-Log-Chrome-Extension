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
      timestamp: { timestampValue: new Date().toISOString() },
    },
  };

  const response = await fetch(
    "https://firestore.googleapis.com/v1/projects/reading-log-chrome-extension/databases/(default)/documents/logs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to save log: ${response.statusText}`);
  }

  console.log("✅ Log saved to Firestore!");
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
  const url = `${BASE_FIRESTORE_URL}/${COLLECTION_PATH}/${logId}?key=${FIREBASE_API_KEY}`;

  try {
    const res = await fetch(url, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error(`Failed to delete log: ${res.status}`);
    console.log("🗑️ Log deleted!");
  } catch (err) {
    console.error("🔥 Error deleting log:", err);
  }
}

// 🛠️ Update a log ---------------------------------------------------------------------------In Progress
export async function updateLogInFirestore(logId, updatedData) {
  const url = `${BASE_FIRESTORE_URL}/${COLLECTION_PATH}/${logId}?key=${FIREBASE_API_KEY}`;

  const body = {
    fields: {
      title:     { stringValue: updatedData.title },
      author:    { stringValue: updatedData.author },
      link:      { stringValue: updatedData.link },
      form:      { stringValue: updatedData.form || "" },
      genre:     { stringValue: updatedData.genre || "" },
      rating:    { integerValue: updatedData.rating || 0 },
      wordsRead: { integerValue: updatedData.wordsRead || 0 },
      notes:     { stringValue: updatedData.notes || "" },
      timestamp: { timestampValue: new Date().toISOString() },
    },
  };

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Failed to update log: ${res.status}`);
    console.log("📝 Log updated!");
  } catch (err) {
    console.error("🔥 Error updating log:", err);
  }
}