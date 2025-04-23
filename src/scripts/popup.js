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
    const historyContainer = document.getElementById("historyContainer");
    const graphContainer = document.getElementById("graphContainer");

    // Monitor authentication state
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log("✅ User is logged in:", user);
            userInfo.textContent = `Logged in as: ${user.displayName}`;
            loginButton.style.display = "none";

            // Fetch and display logs
            try {
                const logs = await getLogsFromFirestore();
                logs.forEach((log) => {
                    const logElement = document.createElement("div");
                    logElement.textContent = `${log.fields.title.stringValue} - ${log.fields.author.stringValue}`;
                    historyContainer.appendChild(logElement);
                });
            } catch (error) {
                console.error("🔥 Error fetching logs:", error);
            }
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
                // Ensure the user is authenticated
                const auth = getAuth();
                if (!auth.currentUser) {
                    alert("Please log in before saving your log.");
                    return;
                }

                // Collect form data
                const logData = {
                    title: document.getElementById("title").value,
                    author: document.getElementById("author").value,
                    link: document.getElementById("link").value,
                    wordsRead: parseInt(document.getElementById("wordsRead").value, 10),
                };

                console.log("🚀 Sending log data to Firestore...");
                await saveLogToFirestore(logData);
                alert("Your log has been saved!");
            } catch (error) {
                console.error("🔥 Error saving log to Firestore:", error);
                alert("There was an error saving your log.");
            }
        });
    } else {
        console.error("🔥 Error: 'readingForm' not found");
    }

    // Display user logs and create graphs
    try {
        const logs = await getLogsFromFirestore();
        console.log("📚 User logs:", logs);

        // Display logs in history
        logs.forEach((log) => {
            const logElement = document.createElement("div");
            logElement.textContent = `${log.fields.title.stringValue} - ${log.fields.author.stringValue}`;
            historyContainer.appendChild(logElement);
        });

        // Use logs to create graphs
        const wordCounts = logs.map((log) => log.fields.wordsRead.integerValue);
        createGraph(graphContainer, wordCounts);
    } catch (error) {
        console.error("🔥 Error fetching logs:", error);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const historyContainer = document.getElementById("historyContainer");

    if (!historyContainer) {
        console.error("🔥 Error: 'historyContainer' element not found in the DOM.");
        return;
    }

    // Monitor authentication state
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log("✅ User is logged in:", user);

            // Fetch and display logs
            try {
                const logs = await getLogsFromFirestore();
                if (!logs || logs.length === 0) {
                    console.log("No logs found for the user.");
                    return;
                }

                logs.forEach((log) => {
                    const logElement = document.createElement("div");
                    logElement.textContent = `${log.fields.title.stringValue} - ${log.fields.author.stringValue}`;
                    historyContainer.appendChild(logElement);
                });
            } catch (error) {
                console.error("🔥 Error fetching logs:", error);
            }
        } else {
            console.log("❌ User is not logged in");
        }
    });
});

// Example function to create a graph
function createGraph(container, data) {
    // Use a library like Chart.js or create a simple graph
    console.log("📊 Creating graph with data:", data);
}
