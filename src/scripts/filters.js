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
          const title = entry.querySelector("h3").innerText.toLowerCase();
          const author = entry.querySelector("p strong")?.nextSibling?.textContent.trim().toLowerCase();
          const genre = entry.innerHTML.match(/<strong>Genre:<\/strong>\s(.*?)\s\|/i)?.[1].toLowerCase();
          const form = entry.innerHTML.match(/<strong>Form:<\/strong>\s(.*?)<\/p>/i)?.[1].toLowerCase();
          const stars = entry.querySelector("p:nth-of-type(4)")?.innerText || "";
          const rating = stars.replace(/[^★]/g, "").length.toString(); // count filled stars
  
          const matchTitle = !titleFilter || title.includes(titleFilter);
          const matchAuthor = !authorFilter || author.includes(authorFilter);
          const matchGenre = !genreFilter || genre === genreFilter.toLowerCase();
          const matchForm = !formFilter || form === formFilter.toLowerCase();
          const matchRating = !ratingFilter || rating === ratingFilter;
  
          if (matchTitle && matchAuthor && matchGenre && matchForm && matchRating) {
            entry.style.display = "";
          } else {
            entry.style.display = "none";
          }
        });
      });
    }
  });
  