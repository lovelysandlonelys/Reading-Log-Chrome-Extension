const title = document.title || "[not found]";

const metaAuthor =
  document.querySelector('meta[name="author"]')?.content ||
  document.querySelector('meta[property="article:author"]')?.content ||
  document.querySelector('meta[name="twitter:creator"]')?.content ||
  "[not found]";

// Send it back to popup
chrome.runtime.sendMessage({ title, author: metaAuthor });
