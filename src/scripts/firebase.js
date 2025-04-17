const FIREBASE_API_KEY = "AIzaSyCOpGI0AUqLMJfjbzqPwIKWuItiIR57El8";  
const PROJECT_ID = "reading-log-chrome-extension";    

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
