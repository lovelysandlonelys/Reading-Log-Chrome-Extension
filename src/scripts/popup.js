import { saveLogToFirestore } from "./firebase.js";

document.addEventListener('DOMContentLoaded', async () => {
    console.log("✅ DOM content loaded, running popup.js");

    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("🔍 Active tab:", tab);

    // Clear stale data in form
    document.getElementById("title").value = '';
    document.getElementById("author").value = '';
    document.getElementById("link").value = '';
    console.log("🧹 Cleared form data");

    // Listen for messages from background script (word count)
    chrome.runtime.onMessage.addListener((message) => {
        if (message.wordCount !== undefined) {
            const input = document.getElementById('wordsRead');
            if (input) {
                input.value = message.wordCount;
                console.log("🔢 Word count received:", message.wordCount);
            }
        }
    });

    // Execute scripts to get page meta info
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
        const titleInput = document.getElementById("title");
        const authorInput = document.getElementById("author");
        const linkInput = document.getElementById("link");

        if (titleInput && msg.title) {
            titleInput.value = msg.title;
            console.log("📄 Title set from page:", msg.title);
        }
        if (authorInput && msg.author) {
            authorInput.value = msg.author;
            console.log("✍️ Author set from page:", msg.author);
        }
        if (linkInput && tab.url) {
            linkInput.value = tab.url;
            console.log("🔗 Link set from tab URL:", tab.url);
        }
    });

    // Submit button click resets the form
    // document.getElementById("submitButton").addEventListener("click", function(event) {
    //     event.preventDefault();
    //     document.getElementById("readingForm").reset();
    //     console.log("🔄 Form reset on submit button click");
    // });

    // Ensure the readingForm exists before attaching the submit listener
    const readingForm = document.getElementById("readingForm");
    if (readingForm) {
        readingForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const logData = {
                title: document.getElementById("title").value,
                author: document.getElementById("author").value,
                wordsRead: parseInt(document.getElementById("wordsRead").value),
                link: document.getElementById("link").value
            };

            console.log("📦 Submitting log data:", logData);

            // Check if the values are populated correctly
            if (!logData.title || !logData.author || !logData.wordsRead || !logData.link) {
                console.error("🔥 Error: Missing one or more required fields in log data");
            }

            try {
                // Log before sending to Firestore
                console.log("🚀 Sending log data to Firestore...");
                await saveLogToFirestore(logData);
                console.log("✅ Log data successfully saved to Firestore");
            } catch (error) {
                // Log any errors that occur
                console.error("🔥 Error saving log to Firestore:", error);
            }
        });
    } else {
        console.error("🔥 Error: 'readingForm' not found");
    }


});
