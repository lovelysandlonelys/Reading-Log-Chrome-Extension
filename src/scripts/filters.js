document.addEventListener('DOMContentLoaded', () => {
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

        // Use a more specific selector for stars
        const stars = entry.querySelector(".log-rating")?.textContent || "";
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
