/* =========================================================
   SHNOBLE'S NIBBLES — main.js
   Shared JavaScript: Observer, counters, nav, slider, accordion
   ========================================================= */

'use strict';

/* ---------------------------------------------------------
   NAV: Scroll-shadow + mobile hamburger
   --------------------------------------------------------- */

const nav = document.querySelector('.site-nav');
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.nav-mobile-menu');

if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-active');
    mobileMenu.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && mobileMenu.classList.contains('is-open')) {
      hamburger.classList.remove('is-active');
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close on nav link click
  mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-active');
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ---------------------------------------------------------
   INTERSECTION OBSERVER — scroll-triggered animations
   --------------------------------------------------------- */

const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      animateObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-animate]').forEach(el => {
  animateObserver.observe(el);
});

/* ---------------------------------------------------------
   ANIMATED COUNTERS
   --------------------------------------------------------- */

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  let count = 0;
  const duration = 1200; // ms
  const step = Math.ceil(target / (duration / 16));

  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = prefix + count.toLocaleString() + suffix;
    if (count >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-target]');
      counters.forEach(counter => animateCounter(counter));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) counterObserver.observe(statsSection);

/* ---------------------------------------------------------
   TESTIMONIALS SLIDER
   --------------------------------------------------------- */

(function initSlider() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.slider-btn--prev');
  const nextBtn = document.querySelector('.slider-btn--next');
  const dots = document.querySelectorAll('.slider-dot');

  let current = 0;
  let slidesPerView = window.innerWidth >= 768 ? 3 : 1;
  const total = cards.length;
  const maxIndex = Math.max(0, total - slidesPerView);

  function getSlidesPerView() {
    return window.innerWidth >= 768 ? 3 : 1;
  }

  function goTo(index) {
    slidesPerView = getSlidesPerView();
    const maxIdx = Math.max(0, total - slidesPerView);
    current = Math.max(0, Math.min(index, maxIdx));
    const pct = (100 / slidesPerView) * current;
    track.style.transform = `translateX(-${pct}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-advance
  let autoSlide = setInterval(() => goTo(current + 1 > maxIndex ? 0 : current + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
      slidesPerView = getSlidesPerView();
      const maxIdx = Math.max(0, total - slidesPerView);
      goTo(current + 1 > maxIdx ? 0 : current + 1);
    }, 5000);
  });

  window.addEventListener('resize', () => goTo(current), { passive: true });

  // Swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });
})();

/* ---------------------------------------------------------
   FAQ ACCORDION
   --------------------------------------------------------- */

document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.accordion-item');
    const isOpen = item.classList.contains('is-open');

    // Close all
    document.querySelectorAll('.accordion-item').forEach(i => {
      i.classList.remove('is-open');
      i.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if was closed)
    if (!isOpen) {
      item.classList.add('is-open');
      header.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ---------------------------------------------------------
   PAW PRINT CURSOR TRAIL (desktop only easter egg)
   --------------------------------------------------------- */

(function initPawTrail() {
  if (window.innerWidth < 1024) return; // desktop only

  const PAW_SVG = `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="20" rx="7" ry="6" opacity="0.9"/>
    <ellipse cx="9"  cy="13" rx="3.5" ry="2.8"/>
    <ellipse cx="23" cy="13" rx="3.5" ry="2.8"/>
    <ellipse cx="12" cy="9"  rx="2.8" ry="2.2"/>
    <ellipse cx="20" cy="9"  rx="2.8" ry="2.2"/>
  </svg>`;

  let throttle = false;
  let flip = false;

  document.addEventListener('mousemove', (e) => {
    if (throttle) return;
    throttle = true;
    setTimeout(() => { throttle = false; }, 120);

    const paw = document.createElement('div');
    paw.className = 'paw-cursor-trail';
    paw.innerHTML = PAW_SVG;
    paw.style.left = (e.clientX - 10) + 'px';
    paw.style.top  = (e.clientY - 10) + 'px';
    paw.style.color = 'var(--primary)';
    paw.style.opacity = '0.35';

    if (flip) paw.style.transform = 'scaleX(-1)';
    flip = !flip;

    document.body.appendChild(paw);
    setTimeout(() => paw.remove(), 800);
  });
})();

/* ---------------------------------------------------------
   PROVINCE TABS (stockists page)
   --------------------------------------------------------- */

const provinceTabs = document.querySelectorAll('.province-tab');
const stockistGroups = document.querySelectorAll('.stockist-group');

provinceTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    provinceTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const province = tab.dataset.province;
    stockistGroups.forEach(group => {
      if (province === 'all' || group.dataset.province === province) {
        group.style.display = '';
      } else {
        group.style.display = 'none';
      }
    });
  });
});

/* ---------------------------------------------------------
   NEWSLETTER FORM (prevent default + simple feedback)
   --------------------------------------------------------- */

const newsletterForms = document.querySelectorAll('.newsletter-form-js');
newsletterForms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    if (!input.value) return;

    btn.textContent = 'You\'re in the pack! 🐾';
    btn.disabled = true;
    input.disabled = true;
  });
});
