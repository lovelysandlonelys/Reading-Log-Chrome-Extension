import { saveLogToFirestore, getLogsFromFirestore } from "./firebase.js";
import { googleLogin } from "./auth.js";
import { getAuth, auth } from "./firebase.js"; // Ensure this is correctly imported

document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ DOM content loaded, running popup.js");

    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("🔍 Active tab:", tab);

    // Clear form data on load
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const linkInput = document.getElementById("link");
    const wordsInput = document.getElementById("wordsRead");

    titleInput.value = '';
    authorInput.value = '';
    linkInput.value = '';
    if (wordsInput) wordsInput.value = '';
    console.log("🧹 Cleared form data");

    // Listen for word count messages
    chrome.runtime.onMessage.addListener((message) => {
        if (message.wordCount !== undefined && wordsInput) {
            wordsInput.value = message.wordCount;
            console.log("🔢 Word count received:", message.wordCount);
        }
    });

    // Inject content scripts
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['src/scripts/wordcount.js']
    });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['src/scripts/pageMeta.js']
    });

    // Listen for page meta info messages
    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.title && titleInput) {
            titleInput.value = msg.title;
            console.log("📄 Title set from page:", msg.title);
        }
        if (msg.author && authorInput) {
            authorInput.value = msg.author;
            console.log("✍️ Author set from page:", msg.author);
        }
        if (tab.url && linkInput) {
            linkInput.value = tab.url;
            console.log("🔗 Link set from tab URL:", tab.url);
        }
    });

    // Handle rating star selection
    const ratingStars = document.querySelectorAll(".rating span");
    let ratingValue = 0;

    ratingStars.forEach(star => {
        star.addEventListener("click", function () {
            // Remove "selected" class from all stars
            ratingStars.forEach(star => star.classList.remove("selected"));
            
            // Add "selected" class to all stars up to the clicked star
            let clickedIndex = Array.from(ratingStars).indexOf(this);
            for (let i = 0; i <= clickedIndex; i++) {
                ratingStars[i].classList.add("selected");
            }
            
            // Set the rating value based on clicked star's data-value
            ratingValue = parseInt(this.getAttribute("data-value"));
        });
    });

    // Handle authentication
    const loginButton = document.getElementById("loginButton");
    const userInfo = document.getElementById("userInfo");
    const readingForm = document.getElementById("readingForm");

    // Monitor authentication state
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log("✅ User is logged in:", user);
            userInfo.textContent = `Logged in as: ${user.displayName}`;
            loginButton.style.display = "none";
        } else {
            console.log("❌ User is not logged in");
            userInfo.textContent = "Not logged in";
            loginButton.style.display = "block";
        }
    });

    // Handle login button click
    loginButton.addEventListener("click", async () => {
        try {
            const user = await googleLogin();
            console.log("✅ User logged in:", user);
        } catch (error) {
            console.error("🔥 Login failed:", error);
        }
    });

    // Handle form submission
    if (readingForm) {
        readingForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
                const title = document.getElementById("title").value || "(No Title)";
                const author = document.getElementById("author").value || "(No Author)";
                const link = document.getElementById("link").value || "#";
                const genre = document.getElementById("genre").value || "Unknown"; // Ensure this matches the genre input's ID
                const form = document.getElementById("form").value || "Unknown"; // Ensure this matches the form input's ID
                const rating = parseInt(document.querySelector(".rating span.selected")?.getAttribute("data-value") || "0", 10);
                const notes = document.getElementById("notes").value || "";

                const logData = {
                    title,
                    author,
                    link,
                    genre,
                    form,
                    rating,
                    notes,
                    wordsRead: parseInt(document.getElementById("wordsRead").value || "0", 10),
                };

                console.log("🚀 Saving log data:", logData);

                await saveLogToFirestore(logData); // Ensure this function is implemented correctly
                alert("Log saved successfully!");
            } catch (error) {
                console.error("🔥 Error saving log:", error);
                alert("Failed to save the log. Please try again.");
            }
        });
    } else {
        console.error("🔥 Error: 'readingForm' not found");
    }
});

// Example function to create a graph
function createGraph(container, data) {
    // Use a library like Chart.js or create a simple graph
    console.log("📊 Creating graph with data:", data);
}
