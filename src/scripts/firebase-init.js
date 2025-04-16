import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOpGI0AUqLMJfjbzqPwIKWuItiIR57El8",
  authDomain: "reading-log-chrome-extension.firebaseapp.com",
  projectId: "reading-log-chrome-extension",
  storageBucket: "reading-log-chrome-extension.firebasestorage.app",
  messagingSenderId: "183603389063",
  appId: "1:183603389063:web:d33467ec73c575c786ce22",
  measurementId: "G-XNQMQ4M90S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Function to add log to Firestore
async function addLog(title, author, link, form, genre, rating, wordsRead, notes) {
  try {
    // Add a new document with the log details
    const docRef = await addDoc(collection(db, "logs"), {
      title: title || "[not found]",
      author: author || "[not found]",
      link: link || "[not found]",
      form: form || "[not found]",
      genre: genre || "[not found]",
      rating: rating || "[not found]",
      wordsRead: wordsRead || 0,
      notes: notes || "[not provided]",
      timestamp: new Date()  // Timestamp when the log was added
    });

    console.log("Log added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding log: ", e);
  }
}

// Example usage: Call this function when the form is submitted or on a button click
document.getElementById("submitButton").addEventListener("click", function(event) {
  event.preventDefault();  // Prevent form submission

  // Get form values
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const link = document.getElementById("link").value;
  const form = document.getElementById("form").value;
  const genre = document.getElementById("genre").value;
  const rating = document.getElementById("rating").value;  // Modify if you're using rating stars
  const wordsRead = document.getElementById("wordsRead").value;
  const notes = document.getElementById("notes").value;

  // Add log to Firestore
  addLog(title, author, link, form, genre, rating, wordsRead, notes);

  // Optionally clear the form after submission
  document.getElementById("readingForm").reset();
});
