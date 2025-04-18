import {
    getLogsFromFirestore,
    deleteLogFromFirestore,
    updateLogInFirestore,
} from "./firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
    const historyContainer = document.getElementById("historyLogsContainer");
    if (!historyContainer) return;

    // Modal elements
    const modal = document.getElementById("editModal");
    const form = document.getElementById("editForm");
    const cancelBtn = document.getElementById("cancelEdit");
    let currentEntry = null;

    const logs = await getLogsFromFirestore();

    if (logs.length === 0) {
        historyContainer.innerHTML = "<p>No logs found.</p>";
        return;
    }

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

        // === DELETE BUTTON ===
        const deleteBtn = entry.querySelector(".delete-btn");
        if (deleteBtn) {
            deleteBtn.addEventListener("click", async () => {
                if (confirm(`Delete "${title}"?`)) {
                    await deleteLogFromFirestore(logId);
                    entry.remove();
                }
            });
        }

        historyContainer.appendChild(entry);
    });

});
