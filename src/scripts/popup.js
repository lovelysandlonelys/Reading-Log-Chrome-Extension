document.addEventListener('DOMContentLoaded', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Clear the title, author, and link fields on popup open to avoid stale data
    document.getElementById("title").value = '';
    document.getElementById("author").value = '';
    document.getElementById("link").value = '';

    // 1. Set up the listener for word count updates
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.wordCount !== undefined) {
            const input = document.getElementById('wordsRead');
            if (input) input.value = message.wordCount;
        }
    });

    // 2. Inject the content script to calculate the word count (wordcount.js)
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['src/scripts/wordcount.js']
    });

    // 3. Inject the content script to fetch the title and author (pageMeta.js)
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['src/scripts/pageMeta.js']
    });

    // 4. Listen for the response from the content script (pageMeta.js)
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        const titleInput = document.getElementById("title");
        const authorInput = document.getElementById("author");
        const linkInput = document.getElementById("link");

        // Update the form fields if the message contains the title, author, or link
        if (titleInput && msg.title) titleInput.value = msg.title;
        if (authorInput && msg.author) authorInput.value = msg.author;
        if (linkInput && tab.url) linkInput.value = tab.url;
    });

    // 5. Handle the submit button click and reset form
    document.getElementById("submitButton").addEventListener("click", function(event) {
        event.preventDefault();  // Prevent form submission

        // Clear form fields after clicking 'Log'
        document.getElementById("readingForm").reset();  // Resets all fields
    });
});
