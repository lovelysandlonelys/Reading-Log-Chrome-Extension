const FIREBASE_API_KEY = "AIzaSyCOpGI0AUqLMJfjbzqPwIKWuItiIR57El8";  
const PROJECT_ID = "reading-log-chrome-extension";    
const BASE_FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const COLLECTION_PATH = "works";


const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/works?key=${FIREBASE_API_KEY}`;

export async function saveLogToFirestore(logData) {
  // Ensure logData fields are properly validated
  const body = {
    fields: {
      title:       { stringValue: logData.title },
      author:      { stringValue: logData.author },
      link:        { stringValue: logData.link },
      form:        { stringValue: logData.form || "" },  // Handle missing form data
      genre:       { stringValue: logData.genre || "" }, // Handle missing genre data
      rating:      { integerValue: logData.rating || 0 }, // Don't convert rating to string
      wordsRead:   { integerValue: logData.wordsRead || 0 }, // Don't convert wordsRead to string
      notes:       { stringValue: logData.notes || "" },  // Handle missing notes
      timestamp:   { timestampValue: new Date().toISOString() }
    }
  };

  console.log("💬 Sending the following data to Firestore:", body);

  try {
    const res = await fetch(FIRESTORE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("🔥 Error:", res.status, await res.text());
      throw new Error("Failed to save log");
    }

    console.log("✅ Log saved to Firestore!");
  } catch (err) {
    console.error("🔥 Firestore error:", err);
  }
}

export async function getLogsFromFirestore() {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/works?key=${FIREBASE_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data.documents || [];
  } catch (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
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
