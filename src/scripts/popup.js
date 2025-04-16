document.addEventListener('DOMContentLoaded', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.wordCount !== undefined) {
        const input = document.getElementById('wordsRead');
        if (input) input.value = message.wordCount;
      }
    });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['src/content/wordcount.js']
    });
  });
  
  document.addEventListener("DOMContentLoaded", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    // Inject the content script into the active tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["src/content/pageMeta.js"]
    });
  
    // Listen for the response from the content script
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      const titleInput = document.getElementById("title");
      const authorInput = document.getElementById("author");
      const linkInput = document.getElementById("link");
  
      if (titleInput && msg.title) titleInput.value = msg.title;
      if (authorInput && msg.author) authorInput.value = msg.author;
      if (linkInput && tab.url) linkInput.value = tab.url;
    });
  });
  
  