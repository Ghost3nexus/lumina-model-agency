# LP EC Showcase Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the LP's EC Showcase section with a 2x3 grid of browser-window mockups showing fictional fashion brand top pages. Scroll-triggered overlay reveals all model photos are AI-generated.

**Architecture:** Static HTML/CSS/JS. New HTML replaces `#showcase` section in `index.html`. New CSS replaces lines 594-797 in `styles.css`. ~15 lines of JS appended to `script.js`. No build step, no frameworks.

**Tech Stack:** HTML5, CSS3 (Grid, BEM), Vanilla JS (IntersectionObserver)

**Spec:** `docs/superpowers/specs/2026-03-26-lp-ec-showcase-redesign.md`

**Working repo:** `/tmp/lumina-studio-lp` (clone of `Ghost3nexus/lumina-studio-lp`)

---

### Task 1: Remove old showcase HTML

**Files:**
- Modify: `/tmp/lumina-studio-lp/index.html:206-347`

- [ ] **Step 1: Delete the old showcase section content**

Replace lines 206-347 in `index.html` with a placeholder that preserves the section shell. Note: the old section uses `class="section-white"` — the new section uses `class="ec-showcase"` (dark background, different padding).

```html
    <!-- ========== EC Showcase (Redesigned) ========== -->
    <section class="ec-showcase" id="showcase">
        <div class="container">
            <p class="ec-showcase__label">AI-Powered EC Pages</p>
            <!-- Grid will be added in Task 4 -->
        </div>
    </section>
```

- [ ] **Step 2: Verify the page still loads**

Open `index.html` in a browser. The showcase section should show as a dark (#0a0a0f) area with the label text. The rest of the page (hero, features, pricing, etc.) should render correctly. Nav anchor `#showcase` should still scroll to the correct position.

- [ ] **Step 3: Commit**

```bash
cd /tmp/lumina-studio-lp
git add index.html
git commit -m "refactor: remove old EC showcase HTML, preserve section shell"
```

---

### Task 2: Remove old showcase CSS, add new base styles

**Files:**
- Modify: `/tmp/lumina-studio-lp/styles.css:597-796`

- [ ] **Step 1: Delete old showcase CSS**

Remove lines 594-797 in `styles.css` (from the comment header `/* Product Page Showcase */` through the closing `}` of the `@media (max-width: 768px)` block for `.ec-page-info`). These classes are: `.showcase-scroll`, `.ec-page`, `.ec-page-header`, `.ec-page-header--dark`, `.ec-page-logo`, `.ec-page-content`, `.ec-page-content--dark`, `.ec-page-gallery`, `.ec-img`, `.ec-img img`, `.ec-img-label`, `.ec-img-label--dark`, `.ec-page-info`, `.ec-category`, `.ec-name`, `.ec-price`, `.ec-colors`, `.ec-cart`, `.ec-cart--dark`, `.ec-ai-tag`, `.ec-ai-tag--dark`, `.showcase-footnote`, and their mobile overrides.

- [ ] **Step 2: Add new showcase base CSS at the same location**

Insert at line 597:

```css
/* ======================================
   EC Showcase — Browser Window Grid
   ====================================== */
.ec-showcase {
    padding: 5rem 0;
    background: #0a0a0f;
}

.ec-showcase__label {
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    text-align: center;
    margin-bottom: 2.5rem;
}

.ec-showcase__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    position: relative;
}

/* Browser window frame */
.ec-browser {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2);
}

.ec-browser__bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
}

.ec-browser__dots {
    display: flex;
    gap: 5px;
}

.ec-browser__dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.ec-browser__url {
    flex: 1;
    margin-left: 8px;
    padding: 3px 10px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 9px;
}

.ec-browser__page {
    overflow: hidden;
    height: 500px;
}

.ec-browser__nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
}

.ec-browser__logo {
    font-size: 11px;
    text-transform: uppercase;
}

.ec-browser__links {
    display: flex;
    gap: 12px;
    font-size: 8px;
    letter-spacing: 0.08em;
}

.ec-browser__hero {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ec-browser__hero img {
    height: 90%;
    object-fit: contain;
    display: block;
}

.ec-browser__hero-text {
    position: absolute;
    bottom: 16px;
    left: 16px;
    font-size: 8px;
    letter-spacing: 0.15em;
}

.ec-browser__products {
    display: grid;
    gap: 1px;
    padding: 1px;
}

.ec-browser__product {
    aspect-ratio: 3 / 4;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ec-browser__product-ph {
    width: 50%;
    height: 70%;
    border-radius: 4px;
}

.ec-browser__footer {
    padding: 8px 16px;
    text-align: center;
    font-size: 7px;
    letter-spacing: 0.1em;
}

/* ── Reveal overlay ── */
.ec-showcase__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.75);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    border-radius: 12px;
    z-index: 10;
}

.ec-showcase__reveal-text {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.02em;
    text-align: center;
    padding: 0 1rem;
}

.ec-showcase__cta {
    text-align: center;
    margin-top: 2rem;
    opacity: 0;
    visibility: hidden;
}

.ec-showcase__cta-sub {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.5);
    margin-bottom: 1rem;
}

.ec-showcase__cta-btn {
    display: inline-block;
    padding: 12px 32px;
    background: #fff;
    color: #111;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
    letter-spacing: 0.02em;
}

.ec-showcase__cta-btn:hover {
    background: #f0f0f0;
}

/* ── Reveal animation ── */
@media (prefers-reduced-motion: no-preference) {
    .ec-showcase__overlay {
        transition: opacity 0.8s ease, visibility 0.8s ease;
    }
    .ec-showcase__reveal-text {
        transition: opacity 0.5s ease 0.3s;
    }
    .ec-showcase__cta {
        transition: opacity 0.5s ease 0.5s, visibility 0.5s ease 0.5s;
    }
}

.ec-showcase__grid.is-revealed .ec-showcase__overlay {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}

.ec-showcase__grid.is-revealed ~ .ec-showcase__cta {
    opacity: 1;
    visibility: visible;
}

/* ── Mobile ── */
@media (max-width: 768px) {
    .ec-showcase__grid {
        grid-template-columns: 1fr;
    }
    .ec-browser__page {
        height: 400px;
    }
    .ec-showcase__reveal-text {
        font-size: 1.1rem;
    }
}
```

- [ ] **Step 3: Verify page loads without CSS errors**

Open `index.html` in browser. The showcase section should show the label text on a dark background. No broken styles elsewhere.

- [ ] **Step 4: Commit**

```bash
cd /tmp/lumina-studio-lp
git add styles.css
git commit -m "refactor: replace old showcase CSS with new browser-grid base styles"
```

---

### Task 3: Add brand variant CSS

**Files:**
- Modify: `/tmp/lumina-studio-lp/styles.css` (append after the new base styles, before the mobile media query)

- [ ] **Step 1: Add brand-specific CSS variants**

Insert before the `/* ── Mobile ── */` comment:

```css
/* ── Brand: VAILLANT (dark) ── */
.ec-browser--vaillant { border: 1px solid #333; }
.ec-browser--vaillant .ec-browser__bar { background: #1a1a1a; }
.ec-browser--vaillant .ec-browser__dots span { background: #555; }
.ec-browser--vaillant .ec-browser__url { background: #111; color: #666; }
.ec-browser--vaillant .ec-browser__page { background: #0a0a0a; }
.ec-browser--vaillant .ec-browser__nav { border-bottom: 1px solid #222; }
.ec-browser--vaillant .ec-browser__logo { font-weight: 700; letter-spacing: 0.15em; color: #fff; }
.ec-browser--vaillant .ec-browser__links { color: #666; }
.ec-browser--vaillant .ec-browser__hero { background: linear-gradient(135deg, #111, #0a0a0a); }
.ec-browser--vaillant .ec-browser__hero img { filter: brightness(0.95); }
.ec-browser--vaillant .ec-browser__hero-text { color: rgba(255,255,255,0.4); }
.ec-browser--vaillant .ec-browser__products { background: #1a1a1a; grid-template-columns: repeat(3, 1fr); }
.ec-browser--vaillant .ec-browser__product { background: #0a0a0a; }
.ec-browser--vaillant .ec-browser__product-ph { background: #1a1a1a; }
.ec-browser--vaillant .ec-browser__footer { color: #333; border-top: 1px solid #1a1a1a; }

/* ── Brand: Maison Elise (warm) ── */
.ec-browser--elise { border: 1px solid #d4c8bb; }
.ec-browser--elise .ec-browser__bar { background: #f0ebe5; }
.ec-browser--elise .ec-browser__dots span { background: #c4b8aa; }
.ec-browser--elise .ec-browser__url { background: #e8e0d8; color: #8a7a6a; }
.ec-browser--elise .ec-browser__page { background: #faf8f5; }
.ec-browser--elise .ec-browser__nav { border-bottom: 1px solid #e0d8d0; }
.ec-browser--elise .ec-browser__logo { font-family: Georgia, serif; font-style: italic; font-weight: 400; letter-spacing: 0.05em; color: #5a4a3a; }
.ec-browser--elise .ec-browser__links { color: #a09080; }
.ec-browser--elise .ec-browser__hero { background: linear-gradient(135deg, #e8ddd2, #d4c8bb); }
.ec-browser--elise .ec-browser__hero-text { font-family: Georgia, serif; font-style: italic; color: rgba(90,74,58,0.5); font-size: 9px; }
.ec-browser--elise .ec-browser__products { grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 12px 16px; }
.ec-browser--elise .ec-browser__product { background: #f0ebe5; border-radius: 4px; }
.ec-browser--elise .ec-browser__product-ph { background: #e0d5c8; border-radius: 3px; }
.ec-browser--elise .ec-browser__footer { color: #c4b8aa; font-family: Georgia, serif; border-top: 1px solid #e8e0d8; }

/* ── Brand: DSTRKT (street, light bg) ── */
.ec-browser--dstrkt { border: 1px solid #ddd; }
.ec-browser--dstrkt .ec-browser__bar { background: #eee; }
.ec-browser--dstrkt .ec-browser__dots span { background: #ccc; }
.ec-browser--dstrkt .ec-browser__url { background: #e0e0e0; color: #888; }
.ec-browser--dstrkt .ec-browser__page { background: #f5f5f5; }
.ec-browser--dstrkt .ec-browser__nav { border-bottom: 1px solid #ddd; }
.ec-browser--dstrkt .ec-browser__logo { font-weight: 800; letter-spacing: 0.15em; color: #111; }
.ec-browser--dstrkt .ec-browser__links { color: #888; }
.ec-browser--dstrkt .ec-browser__hero { background: #e8e8e8; }
.ec-browser--dstrkt .ec-browser__hero-text { color: rgba(0,0,0,0.35); font-weight: 800; font-size: 10px; letter-spacing: 0.2em; }
.ec-browser--dstrkt .ec-browser__products { grid-template-columns: repeat(3, 1fr); gap: 2px; padding: 2px; background: #ddd; }
.ec-browser--dstrkt .ec-browser__product { background: #f5f5f5; }
.ec-browser--dstrkt .ec-browser__product-ph { background: #e0e0e0; }
.ec-browser--dstrkt .ec-browser__footer { color: #aaa; border-top: 1px solid #ddd; }

/* ── Brand: ZAYNE (casual, cream bg) ── */
.ec-browser--zayne { border: 1px solid #d4c8bb; }
.ec-browser--zayne .ec-browser__bar { background: #ede5da; }
.ec-browser--zayne .ec-browser__dots span { background: #c4b8aa; }
.ec-browser--zayne .ec-browser__url { background: #e0d8cc; color: #8a7a6a; }
.ec-browser--zayne .ec-browser__page { background: #f0ece5; }
.ec-browser--zayne .ec-browser__nav { border-bottom: 1px solid #ddd5ca; }
.ec-browser--zayne .ec-browser__logo { font-weight: 600; letter-spacing: 0.08em; color: #3a3020; }
.ec-browser--zayne .ec-browser__links { color: #9a8a7a; }
.ec-browser--zayne .ec-browser__hero { background: linear-gradient(135deg, #e5ddd2, #d8d0c5); }
.ec-browser--zayne .ec-browser__hero-text { color: rgba(58,48,32,0.4); font-size: 9px; }
.ec-browser--zayne .ec-browser__products { grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 12px 16px; }
.ec-browser--zayne .ec-browser__product { background: #e8e0d5; border-radius: 6px; }
.ec-browser--zayne .ec-browser__product-ph { background: #d8d0c2; border-radius: 4px; }
.ec-browser--zayne .ec-browser__footer { color: #b0a090; border-top: 1px solid #ddd5ca; }

/* ── Brand: NORIKO TOKYO (minimal, white bg) ── */
.ec-browser--noriko { border: 1px solid #e8e8e8; }
.ec-browser--noriko .ec-browser__bar { background: #f8f8f8; }
.ec-browser--noriko .ec-browser__dots span { background: #d0d0d0; }
.ec-browser--noriko .ec-browser__url { background: #f0f0f0; color: #aaa; }
.ec-browser--noriko .ec-browser__page { background: #fafafa; }
.ec-browser--noriko .ec-browser__nav { border-bottom: 1px solid #eee; }
.ec-browser--noriko .ec-browser__logo { font-weight: 400; letter-spacing: 0.25em; color: #333; font-size: 10px; }
.ec-browser--noriko .ec-browser__links { color: #aaa; font-size: 7px; letter-spacing: 0.12em; }
.ec-browser--noriko .ec-browser__hero { background: #f0f0f0; }
.ec-browser--noriko .ec-browser__hero-text { color: rgba(0,0,0,0.25); font-size: 8px; letter-spacing: 0.2em; }
.ec-browser--noriko .ec-browser__products { grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 16px; }
.ec-browser--noriko .ec-browser__product { background: #f0f0f0; border-radius: 2px; }
.ec-browser--noriko .ec-browser__product-ph { background: #e5e5e5; border-radius: 2px; }
.ec-browser--noriko .ec-browser__footer { color: #ccc; border-top: 1px solid #eee; }

/* ── Brand: RVLT Supply (navy, athleisure) ── */
.ec-browser--rvlt { border: 1px solid #2a2a4e; }
.ec-browser--rvlt .ec-browser__bar { background: #12122a; }
.ec-browser--rvlt .ec-browser__dots span { background: #444466; }
.ec-browser--rvlt .ec-browser__url { background: #0e0e22; color: #6666aa; }
.ec-browser--rvlt .ec-browser__page { background: #1a1a2e; }
.ec-browser--rvlt .ec-browser__nav { border-bottom: 1px solid #2a2a4e; }
.ec-browser--rvlt .ec-browser__logo { font-weight: 800; font-style: italic; letter-spacing: 0.05em; color: #fff; }
.ec-browser--rvlt .ec-browser__links { color: #8888bb; }
.ec-browser--rvlt .ec-browser__hero { background: linear-gradient(135deg, #222244, #1a1a2e); }
.ec-browser--rvlt .ec-browser__hero img { filter: brightness(0.9); }
.ec-browser--rvlt .ec-browser__hero-text { color: rgba(255,255,255,0.3); font-weight: 800; font-style: italic; }
.ec-browser--rvlt .ec-browser__products { grid-template-columns: repeat(3, 1fr); background: #222244; gap: 1px; padding: 1px; }
.ec-browser--rvlt .ec-browser__product { background: #1a1a2e; }
.ec-browser--rvlt .ec-browser__product-ph { background: #222244; }
.ec-browser--rvlt .ec-browser__footer { color: #444466; border-top: 1px solid #2a2a4e; }
```

- [ ] **Step 2: Commit**

```bash
cd /tmp/lumina-studio-lp
git add styles.css
git commit -m "feat: add 6 brand variant CSS for EC showcase browser mockups"
```

---

### Task 4: Build the 6-brand HTML grid

**Files:**
- Modify: `/tmp/lumina-studio-lp/index.html` (replace the placeholder from Task 1)

- [ ] **Step 1: Replace the placeholder section with the full grid HTML**

Replace the entire `<section class="ec-showcase" id="showcase">` with:

```html
    <!-- ========== EC Showcase (Browser Mockup Grid) ========== -->
    <section class="ec-showcase" id="showcase">
        <div class="container">
            <p class="ec-showcase__label">AI-Powered EC Pages</p>

            <div class="ec-showcase__grid">

                <!-- 1: VAILLANT (Balenciaga-style dark) -->
                <div class="ec-browser ec-browser--vaillant">
                    <div class="ec-browser__bar">
                        <div class="ec-browser__dots"><span></span><span></span><span></span></div>
                        <div class="ec-browser__url">vaillant.com</div>
                    </div>
                    <div class="ec-browser__page">
                        <div class="ec-browser__nav">
                            <span class="ec-browser__logo">VAILLANT</span>
                            <div class="ec-browser__links"><span>WOMEN</span><span>MEN</span><span>COLLECTIONS</span></div>
                        </div>
                        <div class="ec-browser__hero">
                            <img src="assets/images/hero-models/sofia.png" alt="AI fashion model SOFIA" loading="lazy">
                            <span class="ec-browser__hero-text">FW26 COLLECTION</span>
                        </div>
                        <div class="ec-browser__products">
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                        </div>
                        <div class="ec-browser__footer">VAILLANT &copy; 2026</div>
                    </div>
                </div>

                <!-- 2: Maison Elise (AESTHETIC warm luxury) -->
                <div class="ec-browser ec-browser--elise">
                    <div class="ec-browser__bar">
                        <div class="ec-browser__dots"><span></span><span></span><span></span></div>
                        <div class="ec-browser__url">maisonelise.com</div>
                    </div>
                    <div class="ec-browser__page">
                        <div class="ec-browser__nav">
                            <span class="ec-browser__logo">Maison Elise</span>
                            <div class="ec-browser__links"><span>Collection</span><span>Lookbook</span><span>About</span></div>
                        </div>
                        <div class="ec-browser__hero">
                            <img src="assets/images/hero-models/harin.png" alt="AI fashion model HARIN" loading="lazy">
                            <span class="ec-browser__hero-text">Timeless elegance, reimagined</span>
                        </div>
                        <div class="ec-browser__products">
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                        </div>
                        <div class="ec-browser__footer">Maison Elise &mdash; Paris</div>
                    </div>
                </div>

                <!-- 3: DSTRKT (DOLENGA streetwear) -->
                <div class="ec-browser ec-browser--dstrkt">
                    <div class="ec-browser__bar">
                        <div class="ec-browser__dots"><span></span><span></span><span></span></div>
                        <div class="ec-browser__url">dstrkt.com</div>
                    </div>
                    <div class="ec-browser__page">
                        <div class="ec-browser__nav">
                            <span class="ec-browser__logo">DSTRKT</span>
                            <div class="ec-browser__links"><span>SHOP</span><span>LOOKBOOK</span><span>ABOUT</span></div>
                        </div>
                        <div class="ec-browser__hero">
                            <img src="assets/images/hero-models/taku.png" alt="AI fashion model TAKU" loading="lazy">
                            <span class="ec-browser__hero-text">DSTRKT WEAR 2026</span>
                        </div>
                        <div class="ec-browser__products">
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                        </div>
                        <div class="ec-browser__footer">DSTRKT &copy; 2026</div>
                    </div>
                </div>

                <!-- 4: ZAYNE (ZANEROBS casual) -->
                <div class="ec-browser ec-browser--zayne">
                    <div class="ec-browser__bar">
                        <div class="ec-browser__dots"><span></span><span></span><span></span></div>
                        <div class="ec-browser__url">zayne.co</div>
                    </div>
                    <div class="ec-browser__page">
                        <div class="ec-browser__nav">
                            <span class="ec-browser__logo">ZAYNE</span>
                            <div class="ec-browser__links"><span>Shop</span><span>Journal</span><span>About</span></div>
                        </div>
                        <div class="ec-browser__hero">
                            <img src="assets/images/hero-models/marco.png" alt="AI fashion model MARCO" loading="lazy">
                            <span class="ec-browser__hero-text">The Legacy Capsule</span>
                        </div>
                        <div class="ec-browser__products">
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                        </div>
                        <div class="ec-browser__footer">ZAYNE &mdash; Est. 2024</div>
                    </div>
                </div>

                <!-- 5: NORIKO TOKYO (Japanese minimal) -->
                <div class="ec-browser ec-browser--noriko">
                    <div class="ec-browser__bar">
                        <div class="ec-browser__dots"><span></span><span></span><span></span></div>
                        <div class="ec-browser__url">noriko-tokyo.jp</div>
                    </div>
                    <div class="ec-browser__page">
                        <div class="ec-browser__nav">
                            <span class="ec-browser__logo">NORIKO TOKYO</span>
                            <div class="ec-browser__links"><span>Collection</span><span>Story</span><span>Contact</span></div>
                        </div>
                        <div class="ec-browser__hero">
                            <img src="assets/images/hero-models/miku.png" alt="AI fashion model MIKU" loading="lazy">
                            <span class="ec-browser__hero-text">SS26 COLLECTION</span>
                        </div>
                        <div class="ec-browser__products">
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                        </div>
                        <div class="ec-browser__footer">NORIKO TOKYO</div>
                    </div>
                </div>

                <!-- 6: RVLT Supply (athleisure navy) -->
                <div class="ec-browser ec-browser--rvlt">
                    <div class="ec-browser__bar">
                        <div class="ec-browser__dots"><span></span><span></span><span></span></div>
                        <div class="ec-browser__url">rvltsupply.com</div>
                    </div>
                    <div class="ec-browser__page">
                        <div class="ec-browser__nav">
                            <span class="ec-browser__logo">RVLT Supply</span>
                            <div class="ec-browser__links"><span>Shop</span><span>Athletes</span><span>About</span></div>
                        </div>
                        <div class="ec-browser__hero">
                            <img src="assets/images/hero-models/ren.png" alt="AI fashion model REN" loading="lazy">
                            <span class="ec-browser__hero-text">PERFORMANCE SERIES</span>
                        </div>
                        <div class="ec-browser__products">
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                            <div class="ec-browser__product"><div class="ec-browser__product-ph"></div></div>
                        </div>
                        <div class="ec-browser__footer">RVLT Supply &copy; 2026</div>
                    </div>
                </div>

                <!-- Reveal overlay (spans entire grid) -->
                <div class="ec-showcase__overlay">
                    <p class="ec-showcase__reveal-text">Every model on these pages<br>is AI-generated.</p>
                </div>

            </div><!-- /.ec-showcase__grid -->

            <div class="ec-showcase__cta">
                <p class="ec-showcase__cta-sub">撮影コスト¥0。あなたのブランドでも。</p>
                <a href="https://lumina-model-agency.vercel.app/studio" class="ec-showcase__cta-btn" target="_blank">無料で5枚試す</a>
            </div>

        </div>
    </section>
```

- [ ] **Step 2: Open in browser and verify all 6 cards render**

Check: 2x3 grid on desktop. Each card shows browser bar + nav + hero image + product placeholders + footer. Model images load correctly. Overlay is invisible.

- [ ] **Step 3: Check mobile (< 768px)**

Use Chrome DevTools responsive mode at 375px width. Cards should stack to 1 column. Each card full-width.

- [ ] **Step 4: Commit**

```bash
cd /tmp/lumina-studio-lp
git add index.html
git commit -m "feat: add 6-brand browser mockup grid HTML for EC showcase"
```

---

### Task 5: Add reveal JavaScript

**Files:**
- Modify: `/tmp/lumina-studio-lp/script.js` (append at end)

- [ ] **Step 1: Add IntersectionObserver for reveal**

Append to the end of `script.js`:

```javascript
/* ── EC Showcase reveal animation (2026-03-26) ─────────────── */
(function initShowcaseReveal() {
    const grid = document.querySelector('.ec-showcase__grid');
    if (!grid) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                grid.classList.add('is-revealed');
                observer.unobserve(grid);
            }
        });
    }, {
        threshold: 0,
        rootMargin: '-30% 0px -30% 0px'
    });

    observer.observe(grid);
})();
```

- [ ] **Step 2: Test the reveal**

Open in browser. Scroll down to the showcase section. When the grid enters the viewport past 30%, the dark overlay should fade in with the text "Every model on these pages is AI-generated." The CTA below should also fade in.

- [ ] **Step 3: Test one-shot behavior**

Scroll up and back down. The reveal should NOT replay — it stays revealed.

- [ ] **Step 4: Commit**

```bash
cd /tmp/lumina-studio-lp
git add script.js
git commit -m "feat: add IntersectionObserver reveal animation for EC showcase"
```

---

### Task 6: Visual QA and final polish

**Files:**
- Possibly modify: `/tmp/lumina-studio-lp/styles.css`, `/tmp/lumina-studio-lp/index.html`

- [ ] **Step 1: Desktop QA (1440px)**

Open at 1440px width. Check:
- All 6 cards same height (500px page content per spec)
- Browser frames have shadows and rounded corners
- Model images display with `contain` (no cropping)
- Brand colors, fonts, and spacing match spec
- Product placeholder rectangles visible in each card
- Overlay is invisible before scroll trigger

- [ ] **Step 2: Mobile QA (375px)**

Switch to 375px responsive mode. Check:
- Grid collapses to 1 column
- Cards are full-width
- Model images still visible and not cropped
- Reveal animation works on mobile
- CTA button is tappable

- [ ] **Step 3: Tablet QA (768px)**

Check the breakpoint boundary. At 769px should be 2-column. At 768px should be 1-column (max-width: 768px is inclusive).

- [ ] **Step 4: Accessibility check**

- All images have `alt` text
- Reveal text is readable (contrast ratio)
- `prefers-reduced-motion` respected (check in macOS System Preferences)

- [ ] **Step 5: Fix any issues found**

Adjust CSS values as needed. Common fixes:
- Card height too tall/short → adjust `.ec-browser__page` height
- Image positioning → adjust `.ec-browser__hero` aspect-ratio
- Overlay text too large on mobile → already handled in mobile media query
- Product grid gaps → adjust per-brand CSS

- [ ] **Step 6: Final commit**

```bash
cd /tmp/lumina-studio-lp
git add -A
git commit -m "fix: visual QA polish for EC showcase section"
```

---

### Task 7: Push and deploy

**Files:**
- No file changes

- [ ] **Step 1: Verify all changes are committed**

```bash
cd /tmp/lumina-studio-lp
git status
git log --oneline -6
```

Expected: clean working tree, exactly 6 new commits (one per task).

- [ ] **Step 2: Push to main**

```bash
cd /tmp/lumina-studio-lp
git push origin main
```

- [ ] **Step 3: Verify Vercel deployment**

Wait for Vercel auto-deploy. Check https://lumina-studio-lp.vercel.app/ — the showcase section should show the new 2x3 browser grid.

- [ ] **Step 4: Test reveal on production**

Scroll to the showcase section on the live URL. Verify:
- 6 browser windows render with model images
- Scroll-triggered overlay appears
- CTA links to the correct Studio URL
- Mobile view works (test on actual iOS if available)
