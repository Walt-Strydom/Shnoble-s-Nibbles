/* =========================================================
   SHNOBLE'S NIBBLES — products.js
   Product filter logic for products.html
   ========================================================= */

'use strict';

(function initProductFilter() {
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.product-card');

  if (!pills.length || !cards.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Update active pill
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const category = pill.dataset.category;

      cards.forEach(card => {
        const cardCat = card.dataset.category;
        const show = category === 'all' || cardCat === category;

        if (show) {
          card.classList.remove('hidden');
          // Re-trigger animation if it was already visible
          card.style.animation = 'none';
          card.offsetHeight; // force reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });

      // Show "no results" message if all hidden
      const visible = [...cards].filter(c => !c.classList.contains('hidden'));
      const noResults = document.querySelector('.no-results');
      if (noResults) {
        noResults.style.display = visible.length === 0 ? 'block' : 'none';
      }
    });
  });
})();
