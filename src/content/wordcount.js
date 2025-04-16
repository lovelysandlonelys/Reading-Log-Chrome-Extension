(() => {
    const text = document.body.innerText || "";
    const words = text.trim().split(/\s+/).filter(Boolean);
    chrome.runtime.sendMessage({ wordCount: words.length });
  })();
  