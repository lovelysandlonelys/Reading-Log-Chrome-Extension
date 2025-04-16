import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

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
const analytics = getAnalytics(app);
