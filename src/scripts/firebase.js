const FIREBASE_API_KEY = "AIzaSyCOpGI0AUqLMJfjbzqPwIKWuItiIR57El8";  
const PROJECT_ID = "reading-log-chrome-extension";    

const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/works?key=${FIREBASE_API_KEY}`;


export async function saveLogToFirestore(logData) {
  const body = {
    fields: {
      title:        { stringValue: logData.title },
      author:       { stringValue: logData.author },
      wordsRead:    { integerValue: String(logData.wordsRead) },
      link:         { stringValue: logData.link },
      timestamp:    { timestampValue: new Date().toISOString() }
    }
  };

  console.log("💬 Preparing to send the following data to Firestore:", body);

  try {
    const res = await fetch(FIRESTORE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("🔥 Error: Firestore request failed", res.status, await res.text());
      throw new Error("Failed to save log");
    }

    console.log("✅ Log saved to Firestore!");
  } catch (err) {
    console.error("🔥 Firestore error:", err);
  }
}
