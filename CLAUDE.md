# CLAUDE.md — Shnoble's Nibbles Website Refactor
## Project Brief for Claude Code

---

## 1. Project Overview

**Client:** Shnoble's Nibbles  
**URL:** https://shnoblesnibbles.co.za  
**Stack:** Vanilla HTML5 / CSS3 / JavaScript (no framework — fast, portable, self-hosted)  
**Hosting:** Client's cPanel hosting via domains.co.za (shared hosting — Apache + .htaccess)  
**Goal:** A complete front-end refactor — joyful, animated, SEO-dominant, conversion-focused website for a South African premium dog treat / pet food brand.

---

## 2. Architecture Decision: Multi-Page Site (MPA)

**Rationale:** A multi-page architecture is chosen over a single-page application for the following SEO reasons:

- Each page gets its own canonical URL, `<title>`, `<meta description>`, and JSON-LD schema block — dramatically improving crawl efficiency and keyword targeting per page.
- Google crawls and indexes discrete HTML pages faster and more reliably than JS-rendered SPAs.
- Internal linking across pages builds topical authority clusters (treats → ingredients → dog health → stockists).
- Core Web Vitals (LCP, CLS, FID) are easier to optimise page-by-page.

**Pages to Build:**

| Page | Slug | Primary Keyword Target |
|---|---|---|
| Home | `/index.html` | dog treats South Africa / healthy dog snacks |
| Products | `/products.html` | natural dog treats / premium dog biscuits SA |
| About | `/about.html` | Shnoble's Nibbles story / South African pet brand |
| Ingredients | `/ingredients.html` | natural ingredients dog treats / what's in dog treats |
| Dog Health & Tips | `/dog-health.html` | healthy dog lifestyle / dog nutrition tips South Africa |
| Stockists | `/stockists.html` | where to buy dog treats Johannesburg / Cape Town |
| Contact | `/contact.html` | contact Shnoble's Nibbles / dog treats enquiry |

---

## 3. Design Direction & Aesthetic

### 3.1 Brand Personality
**Joyful. Wholesome. Energetic. Trustworthy. South African.**  
Think: a sunny dog park on a Saturday morning — tail-wagging energy, bright colours, the warmth of home-baked treats, and the pride of a local brand that genuinely cares.

### 3.2 Colour Palette
```css
:root {
  --primary:      #FF6B35;  /* Warm tangerine — energetic, appetising */
  --primary-dark: #E55A27;  /* Hover/active states */
  --secondary:    #FFD166;  /* Sunny yellow — joy, warmth */
  --accent:       #06D6A0;  /* Fresh mint — health, natural */
  --accent-dark:  #04A87C;
  --earth:        #8B5E3C;  /* Warm brown — baked, wholesome */
  --earth-light:  #F5ECD7;  /* Cream — background warmth */
  --dark:         #1A1A2E;  /* Deep navy — headlines, contrast */
  --white:        #FFFEF9;  /* Off-white — warmer than pure white */
  --text-body:    #3D3D3D;
  --text-muted:   #7A7A7A;
}
```

### 3.3 Typography
```css
/* Headlines — playful but legible */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Lato:wght@400;700&display=swap');

--font-display: 'Nunito', sans-serif;   /* Rounded, friendly, bold */
--font-body:    'Lato', sans-serif;     /* Clean, readable body copy */
```

Use **Nunito 900** for hero headlines at large sizes (clamp-based responsive sizing).  
Use **Lato 400/700** for all body text, nav items, and CTAs.

### 3.4 Visual Style
- **Illustrated paw print patterns** as section dividers (SVG, CSS-drawn)
- **Wavy/curved section transitions** between content blocks (SVG clip-path or border-radius tricks)
- **Card components** with generous border-radius (20–28px), soft drop shadows, and subtle hover lift
- **Photography style guidance:** bright, natural light; happy dogs mid-treat; outdoor SA settings (golden hour, gardens, beaches, parks)
- **Illustration accents:** simple flat-style dog silhouettes, bone shapes, paw prints — used sparingly as decorative SVG elements
- **No gradients from purple/blue** — warm orange-to-yellow gradients only
- Grain/noise texture overlay on hero section (CSS filter or SVG feTurbulence) for a handcrafted feel

---

## 4. Animations & Interactions

### 4.1 Page Load Animations (Hero)
```css
/* Staggered entrance — hero headline, subtext, CTA, hero image */
.hero-headline  { animation: slideUpFade 0.7s ease both; animation-delay: 0.1s; }
.hero-subtext   { animation: slideUpFade 0.7s ease both; animation-delay: 0.3s; }
.hero-cta       { animation: slideUpFade 0.7s ease both; animation-delay: 0.5s; }
.hero-image     { animation: floatIn    0.9s ease both; animation-delay: 0.2s; }

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0);    }
}

@keyframes floatIn {
  from { opacity: 0; transform: scale(0.92) translateY(20px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
}
```

### 4.2 Scroll-Triggered Animations
Use **Intersection Observer API** (no library needed) to add `.is-visible` class when elements enter viewport:
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
```
Apply to: product cards, ingredient cards, testimonial blocks, "About" section, stat counters.

### 4.3 Hero Dog Animation
- A happy dog SVG or CSS illustration in the hero that **wags its tail** via CSS animation
- Alternatively: a looping CSS animation of paw prints walking across the bottom of the hero
```css
@keyframes wagTail {
  0%,100% { transform: rotate(-15deg); }
  50%      { transform: rotate(15deg);  }
}
.dog-tail { animation: wagTail 0.6s ease-in-out infinite; transform-origin: top left; }
```

### 4.4 Floating Treat Animation
Product cards should have a subtle **floating/bobbing** animation on hover:
```css
.product-card:hover { animation: float 2s ease-in-out infinite; }
@keyframes float {
  0%,100% { transform: translateY(0);   }
  50%      { transform: translateY(-8px); }
}
```

### 4.5 Animated Counter (Stats Section)
Use JavaScript to count up numbers when the stats section scrolls into view:
- "500+ Happy Dogs" / "100% Natural Ingredients" / "6 Delicious Flavours"
```javascript
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let count = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count + el.dataset.suffix;
    if (count >= target) clearInterval(timer);
  }, 20);
}
```

### 4.6 Paw Print Cursor Trail (Optional Easter Egg)
On desktop, a custom cursor that leaves small fading paw print SVGs in its wake — delightful micro-interaction that will be memorable and shareable. Toggle off on mobile.

### 4.7 Micro-Interactions
- **Nav links:** underline slide-in from left on hover
- **CTA buttons:** scale(1.04) + box-shadow deepening on hover, scale(0.97) on active
- **Product images:** zoom (scale 1.08) on card hover with overflow:hidden on card
- **WhatsApp widget:** pulse ring animation to attract attention
- **Form inputs:** border-color transition to `--primary` on focus

---

## 5. Page-by-Page Specifications

### 5.1 `index.html` — Homepage

**Above-the-fold Hero:**
- Full-width section, warm cream background with subtle grain texture
- Large Nunito 900 headline: *"Tails Up. Treats Out."* or *"Happy Dogs Start with Wholesome Nibbles."*
- Subheadline: value prop (natural ingredients, SA-made, vet-approved)
- Two CTAs: **[Shop Now]** (primary, --primary orange) + **[Our Story]** (ghost/outline)
- Hero image: happy dog with a treat, positioned right (desktop) / below headline (mobile)
- Animated paw prints or tail-wagging dog illustration

**Sections (in order):**
1. **Trust Bar** — logos/badges: "100% Natural", "No Artificial Additives", "South African Made", "Vet Recommended" — horizontal scrolling strip with subtle bounce-in
2. **Featured Products** — 3-card grid, product cards with image, name, short description, price, "Add to Cart" / "Order via WhatsApp" CTA
3. **Why Shnoble's** — Icon + text grid: Natural Ingredients | Baked with Love | Locally Sourced | No Nasties — scroll-triggered fade-ins
4. **Happy Dog Gallery** — Masonry or CSS grid of UGC-style happy dog photos (client provides, or use placeholders)
5. **Stats Counter** — 3 animated numbers (dogs fed, flavours, years of love)
6. **Testimonials** — Carousel of 5-star reviews (CSS-only or minimal JS slider), real dog-owner names + dog breed
7. **Instagram Feed Preview** — Static 6-tile grid of recent posts with Instagram logo overlay + "Follow Us @shnoblesnibbles" CTA — link opens Instagram
8. **Newsletter Signup** — "Join the Pack" email capture — warm, fun copy, no spam promise
9. **CTA Footer Banner** — "Your Dog Deserves the Best. Try Shnoble's Today." + WhatsApp order button

### 5.2 `products.html` — Products

- **Hero:** Fun product-focused headline + breadcrumb
- **Filter Bar:** Category pills (All / Biscuits / Chews / Training Treats / Seasonal) — CSS-only filter with JS toggle
- **Product Grid:** 2-col mobile / 3-col desktop — each card:
  - Product image (lazy-loaded)
  - Flavour badge (e.g. "Peanut Butter & Banana")
  - Weight/size options
  - Price in ZAR
  - "Add to WhatsApp Cart" button (opens wa.me link with pre-filled message)
  - "Suitable for:" (puppies / adults / seniors) tag
- **Ingredient Highlights** per product (small icon grid)
- **"Ask Us Anything" WhatsApp CTA** — sticky bottom bar on mobile

### 5.3 `about.html` — About

- **Founder story** — personal, warm, photo of founder with dog
- **Origin story:** Why Shnoble's was started (gap in SA market for truly natural treats)
- **Values grid:** Honesty | Health | Happiness | Heart
- **South African Pride section:** "Proudly SA" flag motif, locally sourced ingredients map
- **The Shnoble Dog mascot** story — if brand has a mascot dog, feature prominently
- **Team / dogs section** — photos of the team and their dogs

### 5.4 `ingredients.html` — Ingredients

- **Hero:** "We Read the Label So You Don't Have To"
- **Ingredient cards:** Each key ingredient with:
  - Name + illustrated icon
  - What it is
  - Why it's good for dogs
  - Which products contain it
- **"Never in Our Treats" section:** Red-cross list of banned ingredients (no xylitol, no artificial colours, etc.)
- This page is a powerful **SEO/E-E-A-T signal** — demonstrates expertise and transparency

### 5.5 `dog-health.html` — Dog Health & Tips

- **Tips & advice grid** (H2s that target long-tail keywords)
- Topics: treat portion sizes, reading pet food labels, exercise routines, healthy weight, senior dog nutrition
- Internal links to ingredient page and products
- This page supports **topical authority** for the domain

### 5.6 `stockists.html` — Where to Buy

- **Province/city filter tabs**
- **Stockist cards** with: store name, address, Google Maps link, opening hours
- **Interactive embedded Google Map** (Google Maps Embed API — no JS SDK needed)
- **"Become a Stockist" CTA** — WhatsApp or email enquiry

### 5.7 `contact.html` — Contact

- Contact form: Name, Email, Dog's Name (fun, memorable), Message
- Form uses **Resend API** or **FormSubmit** (consistent with BrandFlow stack)
- WhatsApp direct link
- Social media links
- FAQ accordion (targets featured snippet opportunities)

---

## 6. WhatsApp Chat Widget

### Implementation
Use a lightweight custom WhatsApp float button — **no third-party widget library** (reduces page weight and privacy risk):

```html
<!-- WhatsApp Float Button -->
<a href="https://wa.me/27XXXXXXXXXX?text=Hi%20Shnoble's%20Nibbles!%20I'd%20like%20to%20order%20some%20treats%20🐾"
   class="whatsapp-float"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Chat with us on WhatsApp">
  <svg><!-- WhatsApp SVG icon --></svg>
  <span class="whatsapp-tooltip">Chat with us!</span>
</a>
```

```css
.whatsapp-float {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  width: 60px;
  height: 60px;
  background: #25D366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(37,211,102,0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

.whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(37,211,102,0.55);
}

/* Pulse ring animation */
.whatsapp-float::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(37,211,102,0.4);
  animation: whatsappPulse 2s ease-out infinite;
}

@keyframes whatsappPulse {
  0%   { transform: scale(1);   opacity: 0.7; }
  100% { transform: scale(1.8); opacity: 0;   }
}

/* Tooltip */
.whatsapp-tooltip {
  position: absolute;
  right: 70px;
  background: var(--dark);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}
.whatsapp-float:hover .whatsapp-tooltip { opacity: 1; }
```

### Pre-filled WhatsApp Messages by Page
Each page should have a contextually relevant pre-filled message:
- **Products page:** `?text=Hi!%20I'd%20like%20to%20order%20from%20your%20product%20range%20🐾`
- **Stockists page:** `?text=Hi!%20Where's%20the%20nearest%20stockist%20to%20me?`
- **Contact page:** `?text=Hi%20Shnoble's!%20I%20have%20a%20question%20about...`

---

## 7. Social Media Integration

### Footer Social Links
```html
<div class="social-links">
  <a href="https://www.instagram.com/shnoblesnibbles" aria-label="Instagram" target="_blank" rel="noopener">
    <!-- Instagram SVG --></a>
  <a href="https://www.facebook.com/shnoblesnibbles" aria-label="Facebook" target="_blank" rel="noopener">
    <!-- Facebook SVG --></a>
  <a href="https://www.tiktok.com/@shnoblesnibbles" aria-label="TikTok" target="_blank" rel="noopener">
    <!-- TikTok SVG --></a>
  <a href="https://wa.me/27XXXXXXXXXX" aria-label="WhatsApp" target="_blank" rel="noopener">
    <!-- WhatsApp SVG --></a>
</div>
```

### Open Graph / Twitter Card Meta Tags (on every page)
```html
<meta property="og:type"        content="website" />
<meta property="og:site_name"   content="Shnoble's Nibbles" />
<meta property="og:title"       content="[Page Title]" />
<meta property="og:description" content="[Page Description]" />
<meta property="og:image"       content="https://shnoblesnibbles.co.za/assets/og/og-[page].jpg" />
<meta property="og:url"         content="https://shnoblesnibbles.co.za/[page].html" />
<meta name="twitter:card"       content="summary_large_image" />
<meta name="twitter:site"       content="@shnoblesnibbles" />
```

**OG Image specs:** 1200×630px, JPEG, <200KB — create one per page with page-specific product/dog imagery.

### Instagram Feed Embed
Use the **Instagram Basic Display API** embed or a static screenshot grid with a "Follow Us" CTA — static is preferred for performance (no third-party JS). Update quarterly.

---

## 8. Advanced SEO Implementation

### 8.1 Technical SEO Foundations

**File Structure:**
```
/
├── index.html
├── products.html
├── about.html
├── ingredients.html
├── dog-health.html
├── stockists.html
├── contact.html
├── sitemap.xml
├── robots.txt
├── .htaccess
└── assets/
    ├── css/
    ├── js/
    ├── images/
    └── og/
```

**`robots.txt`:**
```
User-agent: *
Allow: /
Disallow: /assets/
Sitemap: https://shnoblesnibbles.co.za/sitemap.xml
```

**`sitemap.xml`:** Auto-generate with all page URLs, `<lastmod>`, `<changefreq>`, `<priority>`.
- Homepage: priority 1.0
- Products, About: priority 0.9
- Other pages: priority 0.7

**Canonical Tags:** On every page:
```html
<link rel="canonical" href="https://shnoblesnibbles.co.za/[page].html" />
```

**Hreflang:** If en-ZA only:
```html
<link rel="alternate" hreflang="en-za" href="https://shnoblesnibbles.co.za/" />
<link rel="alternate" hreflang="x-default" href="https://shnoblesnibbles.co.za/" />
```

### 8.2 On-Page SEO Per Page

**Homepage `<head>`:**
```html
<title>Shnoble's Nibbles | Premium Natural Dog Treats South Africa</title>
<meta name="description" content="Wholesome, natural dog treats baked with love in South Africa. No artificial additives. 100% dog-approved. Order online or find a stockist near you." />
<meta name="keywords" content="dog treats South Africa, natural dog snacks, healthy dog biscuits, premium dog treats Johannesburg, South African pet treats" />
```

**Products page:**
```html
<title>Natural Dog Treat Products | Shnoble's Nibbles South Africa</title>
<meta name="description" content="Browse our full range of premium natural dog treats — biscuits, chews, training treats and more. All made with wholesome South African ingredients." />
```

### 8.3 JSON-LD Structured Data

**`index.html` — Organisation + LocalBusiness:**
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://shnoblesnibbles.co.za/#organization",
      "name": "Shnoble's Nibbles",
      "url": "https://shnoblesnibbles.co.za",
      "logo": "https://shnoblesnibbles.co.za/assets/images/logo.png",
      "description": "Premium natural dog treats made in South Africa.",
      "sameAs": [
        "https://www.instagram.com/shnoblesnibbles",
        "https://www.facebook.com/shnoblesnibbles",
        "https://www.tiktok.com/@shnoblesnibbles"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": "English",
        "contactOption": "TollFree"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://shnoblesnibbles.co.za/#website",
      "url": "https://shnoblesnibbles.co.za",
      "name": "Shnoble's Nibbles",
      "publisher": { "@id": "https://shnoblesnibbles.co.za/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://shnoblesnibbles.co.za/products.html?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
```

**`products.html` — ItemList + Product:**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Shnoble's Nibbles Product Range",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "name": "[Product Name]",
        "description": "[Description]",
        "image": "https://shnoblesnibbles.co.za/assets/images/[product].jpg",
        "brand": { "@type": "Brand", "name": "Shnoble's Nibbles" },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "ZAR",
          "price": "[price]",
          "availability": "https://schema.org/InStock",
          "seller": { "@id": "https://shnoblesnibbles.co.za/#organization" }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "47"
        }
      }
    }
  ]
}
```

**`contact.html` / `stockists.html` — FAQPage:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you deliver nationwide in South Africa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! We deliver to all major cities in South Africa via courier. Orders are dispatched within 2 business days."
      }
    },
    {
      "@type": "Question",
      "name": "Are your treats safe for puppies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our puppy-safe range is suitable for dogs 8 weeks and older. Each product is clearly labelled with age suitability."
      }
    }
  ]
}
```

### 8.4 Image SEO
- All images: descriptive `alt` text with natural language (not keyword-stuffed)
  - ✅ `alt="Golden retriever enjoying a peanut butter dog biscuit from Shnoble's Nibbles"`
  - ❌ `alt="dog treats dog biscuits South Africa dog snacks"`
- WebP format with JPEG/PNG fallback using `<picture>` element
- `loading="lazy"` on all below-fold images
- `width` and `height
