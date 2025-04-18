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
            <button class="edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </div>
        <hr>
    `;


        // === EDIT BUTTON HANDLER WITH MODAL ===
        const editBtn = entry.querySelector(".edit-btn");
        if (editBtn) {
            entry.querySelector(".edit-btn").addEventListener("click", () => {
                console.log("Edit button clicked");
            
                currentEntry = entry;
            
                const modal = document.getElementById("editModal");
            
                // Check if the modal is found
                if (modal) {
                    modal.classList.remove("hidden");  // Show modal
                }
            
                const logId = entry.getAttribute("data-log-id"); // or any other identifier
                const title = entry.querySelector(".log-entry-header a").textContent;
                const author = entry.querySelector(".log-entry-author").textContent;
                const link = entry.querySelector(".log-entry-link").textContent;
                const genre = entry.querySelector(".log-entry-genre").textContent;
                const formVal = entry.querySelector(".log-entry-form").textContent;
                const words = entry.querySelector(".log-entry-words").textContent;
                const rating = entry.querySelector(".log-entry-rating").textContent;
                const notes = entry.querySelector(".log-entry-notes").textContent;
            
                // Update form fields
                document.getElementById("edit-id").value = logId;
                document.getElementById("edit-title").value = title;
                document.getElementById("edit-author").value = author;
                document.getElementById("edit-link").value = link;
                document.getElementById("edit-genre").value = genre;
                document.getElementById("edit-form").value = formVal;
                document.getElementById("edit-words").value = words;
                document.getElementById("edit-rating").value = rating;
                document.getElementById("edit-notes").value = notes;
            });
            
        }

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

    // === FORM SUBMISSION FOR EDITING ===
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const updatedData = {
                title: document.getElementById("edit-title").value,
                author: document.getElementById("edit-author").value,
                link: document.getElementById("edit-link").value,
                genre: document.getElementById("edit-genre").value,
                form: document.getElementById("edit-form").value,
                wordsRead: parseInt(document.getElementById("edit-words").value),
                rating: parseInt(document.getElementById("edit-rating").value),
                notes: document.getElementById("edit-notes").value,
            };

            const logId = document.getElementById("edit-id").value;
            await updateLogInFirestore(logId, updatedData);

            if (currentEntry) {
                currentEntry.querySelector("a").textContent = updatedData.title;
                currentEntry.querySelector("a").href = updatedData.link;
                currentEntry.querySelector("p:nth-of-type(2)").innerHTML = `<strong>Author:</strong> ${updatedData.author}`;
                currentEntry.querySelector("p:nth-of-type(3)").innerHTML = `<strong>Genre:</strong> ${updatedData.genre} | <strong>Form:</strong> ${updatedData.form}`;
                currentEntry.querySelector("p:nth-of-type(4)").innerHTML = `<strong>Words Read:</strong> ${updatedData.wordsRead}`;
                currentEntry.querySelector("p:nth-of-type(5)").innerHTML = `<strong>Rating:</strong> ${"★".repeat(updatedData.rating)}${"☆".repeat(5 - updatedData.rating)}`;
                currentEntry.querySelector("p:nth-of-type(6)").innerHTML = `<em>${updatedData.notes}</em>`;
            }

            modal.classList.add("hidden");
            currentEntry = null;
        });
    }

    // === CANCEL BUTTON ===
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            if (modal) {
                modal.classList.add("hidden");
            }
            currentEntry = null;
        });
    }
});
