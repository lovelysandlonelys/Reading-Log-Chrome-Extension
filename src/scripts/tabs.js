document.addEventListener("DOMContentLoaded", () => {
    const tabLinks = document.querySelectorAll(".tablinks");
  
    // Attach click event to all tab buttons
    tabLinks.forEach(button => {
      button.addEventListener("click", event => {
        const tabName = event.target.getAttribute("data-tab");
        openTab(tabName);
      });
    });
  
    // Click the default tab to open it
    const defaultTab = document.querySelector('.tablinks[data-tab="Log"]');
    if (defaultTab) defaultTab.click();
  });
  
  function openTab(tabName) {
    const tabContents = document.querySelectorAll(".tabcontent");
    const tabLinks = document.querySelectorAll(".tablinks");
  
    // Hide all tabs
    tabContents.forEach(tab => tab.style.display = "none");
  
    // Remove 'active' class from all buttons
    tabLinks.forEach(button => button.classList.remove("active"));
  
    // Show the selected tab
    const tabToShow = document.getElementById(tabName);
    if (tabToShow) {
      tabToShow.style.display = "block";
      const activeButton = document.querySelector(`.tablinks[data-tab="${tabName}"]`);
      if (activeButton) activeButton.classList.add("active");
    }
  }
  