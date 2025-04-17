import { saveLogToFirestore } from "./firebase.js";

document.addEventListener('DOMContentLoaded', async () => {
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


    // Handle form submission
    const readingForm = document.getElementById("readingForm");
    if (readingForm) {
        readingForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Get form values
            const logData = {
                title: titleInput.value.trim(),
                author: authorInput.value.trim(),
                link: linkInput.value.trim(),
                form: document.getElementById("form").value,  // Get selected form type
                genre: document.getElementById("genre").value,  // Get selected genre
                wordsRead: parseInt(wordsInput.value) || 0,  // Fallback to 0 if not a valid number
                notes: document.getElementById("notes").value.trim(),
                rating: ratingValue,  // Use the selected rating value
                timestamp: new Date().toISOString()  // Get current timestamp
            };

            console.log("📦 Submitting log data:", logData);

            // Validate form data
            if (!logData.title || !logData.author || !logData.link || !logData.form || !logData.genre || isNaN(logData.wordsRead) || ratingValue === 0) {
                console.error("🔥 Error: Missing or invalid fields in log data");
                alert("Please fill in all required fields.");
                return;
            }

            try {
                console.log("🚀 Sending log data to Firestore...");
                await saveLogToFirestore(logData);
                console.log("✅ Log data successfully saved to Firestore");

                // ✅ Reset form after successful submission
                readingForm.reset();
                // Reset the rating stars
                ratingStars.forEach(star => star.classList.remove("selected"));
                console.log("🧼 Form reset after successful log");
                alert("Your log has been saved!");
            } catch (error) {
                console.error("🔥 Error saving log to Firestore:", error);
                alert("There was an error saving your log.");
            }
        });
    } else {
        console.error("🔥 Error: 'readingForm' not found");
    }
});
