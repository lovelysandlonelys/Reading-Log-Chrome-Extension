(() => {
// Retrieve title or set to '[not found]'
const title = document.title || "[not found]";

// Try to retrieve author from meta tags
const metaAuthor =
  document.querySelector('meta[name="author"]')?.content ||
  document.querySelector('meta[property="article:author"]')?.content ||
  document.querySelector('meta[name="twitter:creator"]')?.content ||
  "[not found]";

// Send title and author back to the popup
chrome.runtime.sendMessage({ title, author: metaAuthor });
})();
