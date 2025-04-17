document.addEventListener('DOMContentLoaded', () => {
    const applyFiltersBtn = document.getElementById("applyFilters");
  
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener("click", () => {
        const titleFilter = document.getElementById("filterTitle").value.toLowerCase();
        const authorFilter = document.getElementById("filterAuthor").value.toLowerCase();
        const genreFilter = document.getElementById("filterGenre").value;
        const formFilter = document.getElementById("filterForm").value;
        const ratingFilter = document.getElementById("filterRating").value;
  
        const logEntries = document.querySelectorAll(".log-entry");
  
        logEntries.forEach((entry) => {
          const title = entry.querySelector(".log-entry-header a")?.textContent.toLowerCase() || "";
          const author = entry.querySelector("p:nth-of-type(1)")?.textContent.split("Author:")[1]?.trim().toLowerCase() || "";
          const genreMatch = entry.querySelector("p:nth-of-type(2)")?.textContent.match(/Genre:\s*(.*?)\s*\|/) || [];
          const formMatch = entry.querySelector("p:nth-of-type(2)")?.textContent.match(/Form:\s*(.*)/) || [];
          const genre = genreMatch[1]?.toLowerCase() || "";
          const form = formMatch[1]?.toLowerCase() || "";
  
          const stars = entry.querySelector("p:nth-of-type(3)")?.textContent || "";
          const rating = stars.replace(/[^★]/g, "").length.toString();
  
          const matchTitle = !titleFilter || title.includes(titleFilter);
          const matchAuthor = !authorFilter || author.includes(authorFilter);
          const matchGenre = !genreFilter || genre === genreFilter.toLowerCase();
          const matchForm = !formFilter || form === formFilter.toLowerCase();
          const matchRating = !ratingFilter || rating === ratingFilter;
  
          entry.style.display = (matchTitle && matchAuthor && matchGenre && matchForm && matchRating) ? "" : "none";
        });
      });
    }
  });
  