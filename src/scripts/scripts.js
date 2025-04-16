document.querySelectorAll('.rating span').forEach(star => {
    star.addEventListener('click', () => {
      // Get the clicked star's value
      let value = parseInt(star.getAttribute('data-value'));
  
      // Remove 'selected' class from all stars first
      document.querySelectorAll('.rating span').forEach(s => s.classList.remove('selected'));
  
      // Loop through the stars and add 'selected' to the ones up to the clicked star
      document.querySelectorAll('.rating span').forEach((s, index) => {
        if (index < value) {
          s.classList.add('selected');
        }
      });
  
      console.log('Selected rating:', value); // This will log the rating value in the console
    });
  });
  