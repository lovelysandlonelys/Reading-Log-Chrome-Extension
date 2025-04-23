import {
  getLogsFromFirestore,
  deleteLogFromFirestore,
} from "./firebase.js";
import { auth } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const historyContainer = document.getElementById("historyLogsContainer");

  // Ensure the container exists
  if (!historyContainer) {
    console.error("🔥 Error: 'historyLogsContainer' not found in the DOM.");
    return;
  }

  // Wait for the user to be authenticated
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      console.error("❌ User not authenticated. Logs cannot be fetched.");
      historyContainer.innerHTML = "<p>Please log in to view your logs.</p>";
      return;
    }

    console.log("✅ User is authenticated:", user);

    try {
      // Fetch logs from Firestore
      const logs = await getLogsFromFirestore();
      console.log("📚 Logs fetched from Firestore:", logs);

      // Handle case where no logs are found
      if (!logs || logs.length === 0) {
        historyContainer.innerHTML = "<p>No logs found.</p>";
        return;
      }

      // Iterate over logs and format them
      logs.forEach((doc) => {
        const fields = doc.fields;
        const logId = doc.name.split("/").pop();

        const title = fields.title?.stringValue || "(No Title)";
        const author = fields.author?.stringValue || "(No Author)";
        const link = fields.link?.stringValue || "#";
        const genre = fields.genre?.stringValue || "Unknown";
        const formVal = fields.form?.stringValue || "Unknown";
        const words = fields.wordsRead?.integerValue || "0";
        const rating = fields.rating?.integerValue || 0;
        const notes = fields.notes?.stringValue || "";

        // Create a log entry element
        const entry = document.createElement("div");
        entry.classList.add("log-entry");

        entry.innerHTML = `
          <div class="log-entry-header">
            <p><strong><a href="${link}" target="_blank">${title}</a></strong></p>
          </div>
          <p><strong>Author:</strong> ${author}</p>
          <p><strong>Genre:</strong> ${genre} | <strong>Form:</strong> ${formVal}</p>
          <p><strong>Words Read:</strong> <span class="words-read">${words}</span></p>
          <p><strong>Rating:</strong> ${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p>
          <p><em>${notes}</em></p>
          <div class="log-entry-actions">
            <button class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
          </div>
          <hr>
        `;

        // Add delete functionality
        const deleteBtn = entry.querySelector(".delete-btn");
        if (deleteBtn) {
          deleteBtn.addEventListener("click", async () => {
            if (confirm(`Delete "${title}"?`)) {
              try {
                await deleteLogFromFirestore(logId);
                entry.remove();
                console.log(`✅ Log "${title}" deleted successfully.`);
              } catch (error) {
                console.error(`🔥 Error deleting log "${title}":`, error);
                alert("Failed to delete the log. Please try again.");
              }
            }
          });
        }

        // Append the log entry to the container
        historyContainer.appendChild(entry);
      });
    } catch (error) {
      console.error("🔥 Error fetching logs:", error);
      historyContainer.innerHTML = "<p>Error loading logs. Please try again later.</p>";
    }
  });
});
