# CLAUDE.md — Shnoble's Nibbles Website
## Project Brief for Claude Code

---

## 1. Project Overview

**Client:** Shnoble's Nibbles
**URL:** https://shnoblesnibbles.co.za
**Stack:** Vanilla HTML5 / CSS3 / JavaScript — **GSAP 3.12.5 + ScrollTrigger** (CDN) for animations. No other frameworks.
**Hosting:** Client's cPanel hosting via domains.co.za (shared hosting — Apache + .htaccess)
**Location:** Randburg, Gauteng, South Africa
**Phone:** +27 66 558 0274
**Goal:** A joyful, animated, SEO-dominant, conversion-focused website for a South African premium freeze-dried dog treat brand.

### Product Identity
Shnoble's Nibbles makes **freeze-dried** dog treats with **three clean ingredients**: chicken liver, sweet potato, and beef bone broth. No additives, no preservatives. This is a key differentiator — always reflect this specificity in copy.

---

## 2. Architecture: Multi-Page Site (MPA)

**Rationale:** Discrete HTML pages for SEO — each gets its own canonical URL, `<title>`, `<meta description>`, and JSON-LD schema block.

**Current Pages:**

| Page | Slug | Primary Keyword Target |
|---|---|---|
| Home | `/index.html` | dog treats South Africa / healthy dog snacks |
| Products | `/products.html` | natural dog treats / premium dog biscuits SA |
| About | `/about.html` | Shnoble's Nibbles story / South African pet brand |
| Ingredients | `/ingredients.html` | natural ingredients dog treats / what's in dog treats |
| Dog Health & Tips | `/dog-health.html` | healthy dog lifestyle / dog nutrition tips South Africa |
| Contact | `/contact.html` | contact Shnoble's Nibbles / dog treats enquiry |

> **Note:** `stockists.html` is planned but not yet live; it is **not** in the nav.

---

## 3. Design System

### 3.1 Brand Personality
**Joyful. Wholesome. Energetic. Trustworthy. South African.**

### 3.2 Colour Palette (CSS Custom Properties)
```css
:root {
  --off-white:   #f0ebe7;   /* page background */
  --text-dark:   #333333;   /* body text — never full black */
  --pink:        #e4babf;   /* accent, hero ground wave */
  --orange:      #e68000;   /* primary CTA, links, accents */
  --orange-dark: #c76a00;   /* hover/active state for orange */
  --surface:     #fbf8f5;   /* .section.alt background */
  --surface-2:   #ffffff;   /* cards, callouts */
  --muted:       #656565;   /* secondary text, lead copy */

  /* Radii */
  --radius-lg:   10px;
  --radius-md:   6px;
  --radius-sm:   3px;

  /* Shadows */
  --shadow-soft:        0 8px 24px rgba(51,51,51,0.09);
  --shadow-lift:        0 16px 40px rgba(51,51,51,0.16);
  --shadow-card:        0 1px 4px rgba(51,51,51,0.05), 0 8px 24px rgba(51,51,51,0.08);
  --shadow-card-hover:  0 2px 8px rgba(51,51,51,0.07), 0 18px 40px rgba(51,51,51,0.14);
}
```

> No purple/blue gradients. Warm orange-to-yellow gradients only.

### 3.3 Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Lato:wght@400;700&display=swap');

--font-display: 'Nunito', sans-serif;  /* h1–h4, Nunito 900 for hero */
--font-body:    'Lato', sans-serif;    /* body, nav, CTAs */
```

Type scale:
- `h1`: `clamp(2.1rem, 5.5vw, 3.8rem)` weight 900
- `h2`: `clamp(1.55rem, 3vw, 2.4rem)` weight 800
- `h3`: `clamp(1.15rem, 2vw, 1.4rem)` weight 700
- `.lead`: `1.1rem`, color `var(--muted)`, max-width `62ch`

### 3.4 Visual Style
- **Hero:** grain texture overlay via inline SVG `feTurbulence` (opacity 0.028) + warm radial gradients (pink bottom-left, orange top-right)
- **Section headings:** `.section-heading` with a 40px × 3px orange `::after` underline bar
- **Section backgrounds:** alternate `.section` (off-white) and `.section.alt` (surface)
- **Cards:** `--radius-md` (6px), `--shadow-card`, hover lifts to `--shadow-card-hover`
- **Hero ground:** pink SVG wave at the bottom of the hero; dog silhouettes stand on it
- **Paw print SVG dividers:** inline SVG paw icons used between `section-heading` and card grids
- **No gradient backgrounds** on cards — keep surfaces clean

---

## 4. Animation System (GSAP)

**Library:** GSAP 3.12.5 + ScrollTrigger loaded via CDN (jsdelivr). Loaded before `main.js` in every page's `</body>`.

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="assets/js/main.js"></script>
```

All animations are inside a `if (!prefersReducedMotion)` guard in `main.js`.

### 4.1 Hero Entrance (GSAP Timeline)
```javascript
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTl
  .from('.hero-eyebrow',  { opacity: 0, y: 18, duration: 0.55, delay: 0.15 })
  .from('.hero-headline', { opacity: 0, y: 42, duration: 0.75 }, '-=0.25')
  .from('.hero-subtext',  { opacity: 0, y: 30, duration: 0.65 }, '-=0.42')
  .from('.hero-cta',      { opacity: 0, y: 20, duration: 0.55 }, '-=0.38')
  .from('.hero-image',    { opacity: 0, scale: 0.91, y: 28, duration: 1.0, ease: 'power2.out' }, '-=0.72');
```

> CSS must **not** set initial `opacity` or `transform` on hero elements — GSAP owns those states.

### 4.2 Hero Silhouette Parallax
Dog silhouettes (`.hero-sil-1`, `.hero-sil-2`) scroll with different `yPercent` speeds via `ScrollTrigger` `scrub: 1.5`.

### 4.3 Scroll-Triggered Animations
Three handlers in `main.js`:

| Handler | Targets | Animation |
|---|---|---|
| Headings | `h1[data-animate]`, `h2.section-heading` | fade + y:32, `power3.out` |
| `[data-animate]` elements | everything else with `data-animate` (excl. grids, stats) | fade + y:26, `power2.out` |
| Card grids | `.card` inside `.grid` or `.values-grid` | staggered y:48, stagger: 0.12 |
| Stats section | `.stat-item` | staggered entrance + JS counter |

Apply `data-animate` to: headings, lead paragraphs, btn-rows, paw dividers.
Cards in `.grid` **do not** need `data-animate` — the grid handler picks them up automatically.

### 4.4 Animated Stats Counter
```javascript
// Triggered by ScrollTrigger on .stats-section
// Each .stat-number reads data-target and data-suffix
// e.g. <span class="stat-number" data-target="500" data-suffix="+">0+</span>
```

### 4.5 Header Scroll State
On scroll > 60px, `.site-header` gets `.scrolled` class — increases blur, tightens padding, shrinks `.brand-logo` to 44px.

### 4.6 Mobile Nav
Hamburger toggle (`.nav-toggle`) adds `.open` to `.site-nav`. Closes on nav link click and outside click.

---

## 5. Page-by-Page Specifications

### 5.1 `index.html` — Homepage

**Hero sections:**
- `.hero-eyebrow`: "100% Natural · Made in SA"
- `.hero-headline`: "Tails Up. Treats Out."
- `.hero-subtext`: three ingredients, zero nasties value prop
- `.btn-row.hero-cta`: `[Shop Treats]` (primary) + `[Our Story]` (secondary)
- `.hero-visual`: stacked `Logo Image.png` + `Logo Centre.png` with drop-shadow
- `.hero-ground`: pink SVG wave + `.hero-sil-1` / `.hero-sil-2` silhouettes

**Content sections:**
1. **Who we are** — freeze-dried process explained, two lead paragraphs + btn-row
2. **Why pups (and people) love us** (`.section.alt`) — 3-card grid: Natural Ingredients / Locally South African / Joy in Every Bite
3. **Stats Counter** — 500+ Happy Dogs | 3 Simple Ingredients | 100% Natural & Honest
4. **Testimonials** (`.section.alt`) — Belinda (Nikey, Yorkshire Terrier, East Rand) + Gayle (Cody, Yorkshire Terrier, Montague WC)
5. **CTA Banner** (`.cta-banner`) — "Your dog deserves the best." + WhatsApp order button

### 5.2 `products.html` — Products
- Hero with breadcrumb
- Filter bar (All / Biscuits / Chews / Training Treats / Seasonal)
- Product grid 2-col mobile / 3-col desktop
- Each card: image, flavour badge, weight/size, ZAR price, WhatsApp CTA, suitability tag
- Sticky WhatsApp bottom bar on mobile

### 5.3 `about.html` — Our Story
- Founder story: Charlotte (Shnoble) and Rufus — two Bichons inspired the brand
- Origin story, values grid, South African pride section
- `.values-grid` uses same card stagger animation as `.grid`

### 5.4 `ingredients.html` — Ingredients
- Hero: "We Read the Label So You Don't Have To"
- Ingredient cards with name, icon, benefit, which products contain it
- "Never in Our Treats" section

### 5.5 `dog-health.html` — Dog Health & Tips
- Tips grid targeting long-tail keywords
- Internal links to ingredients and products

### 5.6 `contact.html` — Contact
- Form: Name, Email, Dog's Name, Message
- WhatsApp direct link + social links
- FAQ accordion

---

## 6. WhatsApp Integration

**Phone:** `+27665580274`

Float button:
```html
<a class="whatsapp-float"
   href="https://wa.me/+27665580274?text=Hi%20Shnoble's%20Nibbles!%20I'd%20like%20to%20find%20out%20more%20about%20your%20treats%20%F0%9F%90%BE"
   target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
  <span class="whatsapp-tooltip">WhatsApp Us</span>
  <!-- WhatsApp SVG (two-path icon) -->
</a>
```

CSS: fixed bottom-right 60×60px green circle (`#25D366`), pulse ring via `::before`, tooltip appears on hover.

**Page-specific pre-filled messages:**
- Homepage/general: `Hi Shnoble's Nibbles! I'd like to find out more about your treats 🐾`
- Products order: `Hi! I'd like to order from your product range 🐾`
- CTA banner: `Hi Shnoble's Nibbles! I'd like to order some treats 🐾`
- Contact: `Hi Shnoble's! I have a question about...`

---

## 7. Social Media & Branding

**Handles (use exactly):**
- Instagram: `https://www.instagram.com/shnobles.nibbles`
- Facebook: `https://www.facebook.com/profile.php?id=61572263503396`
- Threads: `https://www.threads.net/@shnobles.nibbles`
- WhatsApp: `https://wa.me/+27665580274`

> **No TikTok.** The brand is on Threads, not TikTok.

Footer social links are plain text `<a>` tags inside `.socials` (not icon buttons).

---

## 8. SEO Implementation

### 8.1 Page `<head>` pattern
Every page includes:
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
<link rel="icon" type="image/png" href="assets/img/Logo%20Image.png" />
<link rel="apple-touch-icon" href="assets/img/Logo%20Image.png" />
<meta name="theme-color" content="#e68000" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://shnoblesnibbles.co.za/[page].html" />
<link rel="alternate" hreflang="en-za"    href="https://shnoblesnibbles.co.za/[page].html" />
<link rel="alternate" hreflang="x-default" href="https://shnoblesnibbles.co.za/" />
<!-- OG + Twitter cards -->
<!-- JSON-LD schema -->
<link rel="stylesheet" href="assets/css/styles.css" />
```

LCP image gets `<link rel="preload" as="image" fetchpriority="high" />`.

### 8.2 JSON-LD — Organisation (index.html)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://shnoblesnibbles.co.za/#organization",
      "name": "Shnoble's Nibbles",
      "url": "https://shnoblesnibbles.co.za",
      "logo": "https://shnoblesnibbles.co.za/assets/img/Logo%20Image.png",
      "description": "Premium natural freeze-dried dog treats made in South Africa.",
      "address": { "@type": "PostalAddress", "addressLocality": "Randburg", "addressRegion": "Gauteng", "addressCountry": "ZA" },
      "telephone": "+27665580274",
      "sameAs": [
        "https://www.instagram.com/shnobles.nibbles",
        "https://www.facebook.com/profile.php?id=61572263503396",
        "https://www.threads.net/@shnobles.nibbles"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://shnoblesnibbles.co.za/#website",
      "url": "https://shnoblesnibbles.co.za",
      "name": "Shnoble's Nibbles",
      "publisher": { "@id": "https://shnoblesnibbles.co.za/#organization" }
    }
  ]
}
```

Inner pages use `BreadcrumbList` schema.

### 8.3 Image SEO
- Descriptive `alt` text in natural language (not keyword-stuffed)
- `loading="lazy"` on all below-fold images
- LCP images get `fetchpriority="high"`
- WebP preferred with `<picture>` fallback for product photography

### 8.4 File Structure
```
/
├── index.html
├── products.html
├── about.html
├── ingredients.html
├── dog-health.html
├── contact.html
├── sitemap.xml
├── robots.txt
├── .htaccess
└── assets/
    ├── css/styles.css
    ├── js/main.js
    └── img/
        ├── Logo Image.png        ← hero + nav logo
        ├── Logo Centre.png       ← hero stacked image
        ├── Sil 1.png             ← dog silhouette (parallax left)
        └── Sil 2.png             ← dog silhouette (parallax right)
```

---

## 9. HTML Component Patterns

### Header (every page)
```html
<header class="site-header">
  <div class="container nav-wrap">
    <a class="brand" href="index.html">
      <img src="assets/img/Logo Image.png" alt="Shnoble's Nibbles" class="brand-logo">
    </a>
    <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
    <nav class="site-nav" aria-label="Main navigation">
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="products.html">Products</a></li>
        <li><a href="about.html">Our Story</a></li>
        <li><a href="ingredients.html">Ingredients</a></li>
        <li><a href="dog-health.html">Dog Health</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </nav>
  </div>
</header>
```

Set `class="active"` on the current page's nav link.

### Footer (every page)
Three-column grid: brand/tagline/contact | quick links | social links
`.footer-bottom`: copyright + "Made with love in Randburg, Gauteng"

### Buttons
```html
<a class="btn primary" href="#">Primary CTA</a>
<a class="btn secondary" href="#">Secondary / Ghost</a>
<a class="btn primary-inv" href="#">Inverted (on dark/orange bg)</a>
```

### Section skeleton
```html
<section class="section [alt]">
  <div class="container">
    <h2 class="section-heading" data-animate>Heading</h2>
    <!-- optional paw divider -->
    <div class="section-paw-divider" data-animate aria-hidden="true">
      <!-- 3× paw SVG -->
    </div>
    <div class="grid cards">
      <article class="card" data-animate>…</article>
    </div>
  </div>
</section>
```
