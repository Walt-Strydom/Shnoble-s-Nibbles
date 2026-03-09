/* ============================================
   Shnoble's Nibbles — main.js
   ============================================ */

/* ── 1. Scroll-triggered Animations ────────── */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      animObserver.unobserve(entry.target); // fire once only
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('[data-animate]').forEach((el) => animObserver.observe(el));


/* ── 2. Animated Stats Counters ─────────────── */
function animateCounter(el) {
  const target  = parseInt(el.dataset.target, 10);
  const suffix  = el.dataset.suffix || '';
  let   count   = 0;
  const step    = Math.max(1, Math.ceil(target / 60));

  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count + suffix;
    if (count >= target) clearInterval(timer);
  }, 20);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);


/* ── 3. Mobile Navigation Toggle ────────────── */
const navToggle = document.querySelector('.nav-toggle');
const siteNav   = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is clicked (mobile UX)
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !siteNav.contains(e.target)) {
      siteNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ── 4. Paw Print Cursor Trail (desktop easter egg) ── */
(function initPawTrail() {
  // Only on devices with a fine pointer (mouse), not touch
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const PAW_SVG = `<svg viewBox="0 0 40 44" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <ellipse cx="20" cy="33" rx="13" ry="10"/>
    <ellipse cx="7" cy="19" rx="5.5" ry="6.5" transform="rotate(-15 7 19)"/>
    <ellipse cx="15" cy="12" rx="5.5" ry="6.5"/>
    <ellipse cx="25" cy="12" rx="5.5" ry="6.5"/>
    <ellipse cx="33" cy="19" rx="5.5" ry="6.5" transform="rotate(15 33 19)"/>
  </svg>`;

  let lastX = 0, lastY = 0, moveCount = 0;
  const MAX_PAWS = 8;
  const activePaws = [];

  function spawnPaw(x, y) {
    if (activePaws.length >= MAX_PAWS) {
      const old = activePaws.shift();
      old.remove();
    }

    const paw = document.createElement('div');
    paw.innerHTML = PAW_SVG;
    paw.style.cssText = `
      position: fixed;
      left: ${x - 12}px;
      top:  ${y - 12}px;
      width: 24px;
      height: 24px;
      color: var(--pink);
      opacity: 0.7;
      pointer-events: none;
      z-index: 9998;
      transform: rotate(${Math.random() * 40 - 20}deg);
      transition: opacity 0.7s ease;
    `;
    document.body.appendChild(paw);
    activePaws.push(paw);

    // Fade out after short delay
    setTimeout(() => { paw.style.opacity = '0'; }, 300);
    setTimeout(() => {
      paw.remove();
      const idx = activePaws.indexOf(paw);
      if (idx !== -1) activePaws.splice(idx, 1);
    }, 1000);
  }

  document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 48) { // only spawn every ~48px of movement
      moveCount++;
      lastX = e.clientX;
      lastY = e.clientY;
      // Alternate left/right paw offset for a walking pattern
      const offset = (moveCount % 2 === 0) ? 10 : -10;
      const angle  = Math.atan2(dy, dx);
      const perpX  = Math.cos(angle + Math.PI / 2) * offset;
      const perpY  = Math.sin(angle + Math.PI / 2) * offset;
      spawnPaw(e.clientX + perpX, e.clientY + perpY);
    }
  });
}());
