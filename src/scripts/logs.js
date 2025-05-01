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
          <p><strong>Words Read:</strong> ${words}</p>
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
            const confirmation = confirm(`Are you sure you want to delete "${title}"?`);
            if (!confirmation) return;

            try {
              console.log(`🗑️ Attempting to delete log with ID: ${logId}`);
              await deleteLogFromFirestore(logId); // Call Firestore delete function
              entry.remove(); // Remove the log entry from the DOM
              console.log(`✅ Log "${title}" deleted successfully.`);
            } catch (error) {
              console.error(`🔥 Error deleting log "${title}":`, error);

              // Provide a more user-friendly error message
              if (error.message.includes("permission")) {
                alert("You do not have permission to delete this log.");
              } else {
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

  const applyFiltersBtn = document.getElementById("applyFilters");

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
      const titleFilter = document.getElementById("filterTitle")?.value.toLowerCase() || "";
      const authorFilter = document.getElementById("filterAuthor")?.value.toLowerCase() || "";
      const genreFilter = document.getElementById("filterGenre")?.value.toLowerCase() || "";
      const formFilter = document.getElementById("filterForm")?.value.toLowerCase() || "";
      const ratingFilter = document.getElementById("filterRating")?.value || "";

      const logEntries = document.querySelectorAll(".log-entry");

      logEntries.forEach((entry) => {
        const title = entry.querySelector(".log-entry-header a")?.textContent.toLowerCase() || "";
        const author = entry.querySelector("p:nth-of-type(1)")?.textContent.split("Author:")[1]?.trim().toLowerCase() || "";
        const genreMatch = entry.querySelector("p:nth-of-type(2)")?.textContent.match(/Genre:\s*(.*?)\s*\|/) || [];
        const formMatch = entry.querySelector("p:nth-of-type(2)")?.textContent.match(/Form:\s*(.*)/) || [];
        const genre = genreMatch[1]?.toLowerCase() || "";
        const form = formMatch[1]?.toLowerCase() || "";

        // Debug the DOM structure
        console.log("Log entry DOM:", entry.innerHTML);

        // Use a more specific selector for stars
        const stars = entry.querySelector("p:nth-of-type(4)")?.textContent || ""; // Adjust this selector as needed
        console.log("Stars from DOM:", stars);

        const rating = stars.replace(/[^★]/g, "").length.toString();
        console.log("Rating from DOM:", rating);

        const matchTitle = !titleFilter || title.includes(titleFilter);
        const matchAuthor = !authorFilter || author.includes(authorFilter);
        const matchGenre = !genreFilter || genre === genreFilter;
        const matchForm = !formFilter || form === formFilter;

        // Convert ratingFilter and rating to numbers for comparison
        const ratingFilterValue = parseInt(ratingFilter, 10);
        console.log("Rating filter value:", ratingFilterValue);

        const matchRating = !ratingFilter || parseInt(rating, 10) === ratingFilterValue;

        // Show or hide the entry based on the filters
        entry.style.display = (matchTitle && matchAuthor && matchGenre && matchForm && matchRating) ? "" : "none";
      });
    });
  }
});
