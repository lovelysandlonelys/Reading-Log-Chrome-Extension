document.querySelectorAll('.rating span').forEach(star => {
    star.addEventListener('click', () => {
      let value = star.getAttribute('data-value');
      document.querySelectorAll('.rating span').forEach(s => s.classList.remove('selected'));
      star.classList.add('selected');
      star.previousElementSibling?.classList.add('selected');
      star.previousElementSibling?.previousElementSibling?.classList.add('selected');
      star.previousElementSibling?.previousElementSibling?.previousElementSibling?.classList.add('selected');
      star.previousElementSibling?.previousElementSibling?.previousElementSibling?.previousElementSibling?.classList.add('selected');
      console.log('Selected rating:', value);
    });
  });
  