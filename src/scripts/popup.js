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
  
  document.addEventListener('DOMContentLoaded', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    // Autofill the 'link' input with the current tab's URL
    const linkInput = document.getElementById('link');
    if (linkInput && tab.url) {
      linkInput.value = tab.url;
    }
  });
  