document.addEventListener("DOMContentLoaded", () => {
  const tabLinks = document.querySelectorAll(".tablinks");
  const tabContents = document.querySelectorAll(".tabcontent");

  tabLinks.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");

      // Hide all tab contents
      tabContents.forEach((content) => content.style.display = "none");

      // Show the selected tab content
      document.getElementById(targetTab).style.display = "block";

      // Highlight the active tab
      tabLinks.forEach((link) => link.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  // Show the first tab by default
  tabLinks[0].click();
});
