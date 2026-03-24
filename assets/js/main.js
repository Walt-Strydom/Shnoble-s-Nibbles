/* ============================================
   Shnoble's Nibbles — main.js (GSAP Edition)
   ============================================ */

/* ── 1. Plugin Registration ─────────────────── */
gsap.registerPlugin(ScrollTrigger);


/* ── 2. Reduced Motion Guard ────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ── 3. Header Scroll State ─────────────────── */
const header = document.querySelector('.site-header');

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}


/* ── 4. Mobile Navigation Toggle ────────────── */
const navToggle = document.querySelector('.nav-toggle');
const siteNav   = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !siteNav.contains(e.target)) {
      siteNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ── All GSAP Animations (skipped if reduced motion) ── */
if (!prefersReducedMotion) {

  /* ── 5. Hero Entrance Timeline ─────────────── */
  const heroHeadline = document.querySelector('.hero-headline');

  if (heroHeadline) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .from('.hero-eyebrow',  { opacity: 0, y: 18, duration: 0.55, delay: 0.15 })
      .from('.hero-headline', { opacity: 0, y: 42, duration: 0.75 }, '-=0.25')
      .from('.hero-subtext',  { opacity: 0, y: 30, duration: 0.65 }, '-=0.42')
      .from('.hero-cta',      { opacity: 0, y: 20, duration: 0.55 }, '-=0.38')
      .from('.hero-image',    {
        opacity: 0,
        scale: 0.91,
        y: 28,
        duration: 1.0,
        ease: 'power2.out'
      }, '-=0.72');
  }


  /* ── 6. Hero Parallax — Silhouettes ──────────── */
  const sil1 = document.querySelector('.hero-sil-1');
  const sil2 = document.querySelector('.hero-sil-2');

  if (sil1 && sil2) {
    gsap.to(sil1, {
      yPercent: 28,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    gsap.to(sil2, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }


  /* ── 7. ScrollTrigger: Headings ─────────────── */
  // Covers: h1 with data-animate (inner pages) + all .section-heading h2s
  gsap.utils.toArray('h1[data-animate], h2.section-heading').forEach((heading) => {
    gsap.from(heading, {
      opacity: 0,
      y: 32,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 88%',
        once: true
      }
    });
  });


  /* ── 8. ScrollTrigger: [data-animate] Elements ── */
  // Skips headings, grid children, and stats items — each handled by their own handler below
  gsap.utils.toArray('[data-animate]').forEach((el) => {
    // Headings → handled by handler 7
    if (el.tagName === 'H1' || el.tagName === 'H2') return;
    // Cards inside grids → handled by handler 9
    if (el.closest('.grid') || el.closest('.values-grid')) return;
    // Stat items → handled by handler 10
    if (el.closest('.stats-section')) return;

    gsap.from(el, {
      opacity: 0,
      y: 26,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true
      }
    });
  });


  /* ── 9. ScrollTrigger: Card Grids with Stagger ── */
  // Covers .grid (homepage, ingredients, dog-health) and .values-grid (about)
  document.querySelectorAll('.grid, .values-grid').forEach((grid) => {
    const cards = grid.querySelectorAll('.card');

    if (cards.length === 0) return;

    gsap.from(cards, {
      opacity: 0,
      y: 48,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        once: true
      }
    });
  });


  /* ── 10. GSAP Stats Counter ──────────────────── */
  const statsSection = document.querySelector('.stats-section');

  if (statsSection) {
    ScrollTrigger.create({
      trigger: statsSection,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        // Stagger stat items in
        gsap.from(statsSection.querySelectorAll('.stat-item'), {
          opacity: 0,
          y: 40,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out'
        });

        // Count-up numbers
        statsSection.querySelectorAll('.stat-number[data-target]').forEach((el) => {
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          const obj    = { val: 0 };

          gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.round(obj.val) + suffix;
            }
          });
        });
      }
    });
  }


  /* ── 11. GSAP Card Hover Effects ─────────────── */
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        boxShadow: 'var(--shadow-card-hover)',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        boxShadow: 'var(--shadow-card)',
        duration: 0.4,
        ease: 'power2.inOut',
        overwrite: 'auto'
      });
    });
  });


  /* ── 12. CTA Banner Entrance ─────────────────── */
  const ctaBanner = document.querySelector('.cta-banner');

  if (ctaBanner) {
    gsap.from(ctaBanner.querySelectorAll('h2, p, .btn'), {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.14,
      scrollTrigger: {
        trigger: ctaBanner,
        start: 'top 80%',
        once: true
      }
    });
  }

} // end prefersReducedMotion guard


/* ── 13. Paw Print Cursor Trail (desktop easter egg) ── */
(function initPawTrail() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const PAW_SVG = `<svg viewBox="0 0 40 44" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <ellipse cx="20" cy="33" rx="13" ry="10"/>
    <ellipse cx="7" cy="19" rx="5.5" ry="6.5" transform="rotate(-15 7 19)"/>
    <ellipse cx="15" cy="12" rx="5.5" ry="6.5"/>
    <ellipse cx="25" cy="12" rx="5.5" ry="6.5"/>
    <ellipse cx="33" cy="19" rx="5.5" ry="6.5" transform="rotate(15 33 19)"/>
  </svg>`;

  let lastX = 0, lastY = 0, moveCount = 0;
  const MAX_PAWS  = 8;
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

    setTimeout(() => { paw.style.opacity = '0'; }, 300);
    setTimeout(() => {
      paw.remove();
      const idx = activePaws.indexOf(paw);
      if (idx !== -1) activePaws.splice(idx, 1);
    }, 1000);
  }

  document.addEventListener('mousemove', (e) => {
    const dx   = e.clientX - lastX;
    const dy   = e.clientY - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 48) {
      moveCount++;
      lastX = e.clientX;
      lastY = e.clientY;
      const offset = (moveCount % 2 === 0) ? 10 : -10;
      const angle  = Math.atan2(dy, dx);
      const perpX  = Math.cos(angle + Math.PI / 2) * offset;
      const perpY  = Math.sin(angle + Math.PI / 2) * offset;
      spawnPaw(e.clientX + perpX, e.clientY + perpY);
    }
  });
}());
