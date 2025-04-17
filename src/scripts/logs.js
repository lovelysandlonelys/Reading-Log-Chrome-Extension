import { getLogsFromFirestore } from "./firebase.js";

document.addEventListener('DOMContentLoaded', async () => {
  const historyContainer = document.getElementById("historyLogsContainer");

  if (!historyContainer) return;

  const logs = await getLogsFromFirestore();

  if (logs.length === 0) {
    historyContainer.innerHTML = "<p>No logs found.</p>";
    return;
  }

  logs.forEach((doc) => {
    const fields = doc.fields;
    const entry = document.createElement("div");
    entry.classList.add("log-entry");

    const title = fields.title?.stringValue || "(No Title)";
    const author = fields.author?.stringValue || "(No Author)";
    const link = fields.link?.stringValue || "#";
    const genre = fields.genre?.stringValue || "Unknown";
    const form = fields.form?.stringValue || "Unknown";
    const words = fields.wordsRead?.integerValue || "0";
    const rating = fields.rating?.integerValue || 0;
    const notes = fields.notes?.stringValue || "";

    entry.innerHTML = `
      <h3><a href="${link}" target="_blank">${title}</a></h3>
      <p><strong>Author:</strong> ${author}</p>
      <p><strong>Genre:</strong> ${genre} | <strong>Form:</strong> ${form}</p>
      <p><strong>Words Read:</strong> ${words}</p>
      <p><strong>Rating:</strong> ${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p>
      <p><em>${notes}</em></p>
      <hr>
    `;

    historyContainer.appendChild(entry);
  });
});
