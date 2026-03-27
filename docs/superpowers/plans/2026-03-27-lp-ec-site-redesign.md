# LP → LUMINA EC Site Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the LUMINA STUDIO LP as a realistic fashion EC site with product grid, 6 PDP pages, AI reveal section, and preserved sales sections (Pricing/FAQ/Contact).

**Architecture:** Single-page static HTML with SPA-style JS view switching. Three files: `index.html` (complete rewrite of body content), `styles.css` (replace most CSS, keep pricing/faq/contact/footer styles), `script.js` (replace most JS, keep FAQ accordion + contact form).

**Tech Stack:** HTML5, CSS3 (Grid, Sticky), Vanilla JS (IntersectionObserver, view toggle)

**Spec:** `docs/superpowers/specs/2026-03-27-lp-ec-site-redesign.md`

**Working repo:** `/tmp/lumina-studio-lp`

---

### Task 1: Strip old sections, keep preserved sections

**Files:**
- Modify: `/tmp/lumina-studio-lp/index.html`

This is the biggest single change. Remove everything between `</head><body>` and the pricing section, then insert new nav + empty EC containers.

- [ ] **Step 1: Read the full index.html to understand line numbers**

Read the file. Identify:
- Lines 144-203: old navbar + hero slider → REMOVE
- Lines 206-459: old EC showcase → REMOVE
- Lines 462-610: features/workflow → REMOVE
- Lines 613-662: problems → REMOVE
- Lines 665-832: how-it-works → REMOVE
- Lines 835-845: mid CTA → REMOVE
- Lines 848-901: why-lumina → REMOVE
- Lines 904-951: production/AI models → REMOVE
- Lines 954+: pricing → KEEP
- Lines 1036+: faq → KEEP
- Lines 1148+: contact → KEEP
- Lines 1201+: footer → KEEP

- [ ] **Step 2: Replace lines 144-951 with new nav + EC shell**

Delete everything from `<nav class="navbar"` through the end of the `#production` section (line 951). Insert:

```html
    <!-- ========== EC NAV ========== -->
    <nav class="ec-nav">
        <div class="ec-nav__logo">LUMINA</div>
        <div class="ec-nav__links">
            <span>WOMEN</span><span>MEN</span><span>COLLECTION</span><span>ABOUT</span>
        </div>
        <div class="ec-nav__icons">
            <span>検索</span><span>カート(0)</span>
        </div>
    </nav>

    <!-- ========== EC GRID VIEW (default) ========== -->
    <div class="ec-view ec-grid-view is-active" id="gridView">
        <!-- Grid will be populated in Task 3 -->
    </div>

    <!-- ========== EC PDP VIEWS ========== -->
    <!-- PDPs will be added in Task 4 -->

    <!-- ========== REVEAL ========== -->
    <section class="ec-reveal" id="reveal">
        <div class="ec-reveal__inner">
            <h2 class="ec-reveal__title">全てのモデル着用画像は、<br>AIが生成しました。</h2>
            <p class="ec-reveal__sub">商品画像をアップロードするだけ。撮影コスト¥0。</p>
            <a href="https://lumina-model-agency.vercel.app/studio" class="ec-reveal__cta" target="_blank">無料で5枚試す</a>
        </div>
    </section>
```

- [ ] **Step 3: Verify pricing/faq/contact/footer still exist after the reveal section**

Grep for `id="pricing"`, `id="faq"`, `id="contact"`, `class="footer"` — all must still be present.

- [ ] **Step 4: Commit**

```bash
cd /tmp/lumina-studio-lp
git add index.html
git commit -m "refactor: strip old LP sections, add new EC nav + reveal shell"
```

---

### Task 2: Replace CSS

**Files:**
- Modify: `/tmp/lumina-studio-lp/styles.css`

- [ ] **Step 1: Read styles.css and identify sections to remove/keep**

Read the file. Identify which CSS blocks belong to removed HTML sections (navbar, hero, showcase, features, problems, how-it-works, mid-cta, why-lumina, production) and which belong to kept sections (pricing, faq, contact, footer, utilities, animations).

- [ ] **Step 2: Remove all CSS for deleted sections**

Remove CSS for: `.navbar`, `.hero-slider`, `.hero-*`, `.ec-showcase`, `.ec-browser`, all brand variants, `.kive-*`, `.problems-*`, `.k3-*`, `.mid-cta`, `.why-*`, `.model-*`, `.section-dark` (mid-cta only). Keep: `.section-alt`, `.section-white`, `.container`, pricing CSS, faq CSS, contact CSS, footer CSS, utility classes, animations, media queries for kept sections.

- [ ] **Step 3: Add new EC site CSS at the top of the file (after resets/base)**

Insert new CSS:

```css
/* ======================================
   EC Nav
   ====================================== */
.ec-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 32px;
    border-bottom: 1px solid #eee;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
}
.ec-nav__logo {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: #111;
}
.ec-nav__links {
    display: flex;
    gap: 20px;
    font-size: 11px;
    color: #888;
    letter-spacing: 0.08em;
}
.ec-nav__icons {
    display: flex;
    gap: 16px;
    font-size: 11px;
    color: #888;
}

/* ======================================
   View Switching
   ====================================== */
.ec-view { display: none; }
.ec-view.is-active { display: block; }

/* ======================================
   Product Grid
   ====================================== */
.ec-grid-view {
    background: #fafafa;
}
.ec-grid__header {
    text-align: center;
    padding: 40px 0 24px;
}
.ec-grid__header h2 {
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.2em;
    color: #888;
}
.ec-product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2px;
}
.ec-product-card {
    cursor: pointer;
    overflow: hidden;
    background: #f0f0f0;
}
.ec-product-card__img {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    display: block;
    transition: opacity 0.3s;
}
.ec-product-card:hover .ec-product-card__img {
    opacity: 0.9;
}
.ec-product-card__info {
    padding: 10px 12px 16px;
    background: #fff;
}
.ec-product-card__name {
    font-size: 10px;
    font-weight: 500;
    margin-bottom: 3px;
    color: #111;
}
.ec-product-card__price {
    font-size: 10px;
    color: #666;
}

/* ======================================
   PDP
   ====================================== */
.ec-pdp {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 1200px;
    margin: 0 auto;
    min-height: calc(100vh - 53px);
}
.ec-pdp__images {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.ec-pdp__img-item {
    position: relative;
    overflow: hidden;
}
.ec-pdp__img-item img {
    width: 100%;
    display: block;
}
.ec-pdp__img-item--product {
    background: #f5f5f5;
}
.ec-pdp__img-item--product img {
    object-fit: contain;
    padding: 16px;
    aspect-ratio: 3 / 4;
}
.ec-pdp__img-item--ai img {
    object-fit: cover;
}
.ec-pdp__badge {
    position: absolute;
    bottom: 8px;
    left: 8px;
    padding: 3px 8px;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 0.05em;
    border-radius: 3px;
    color: #fff;
}
.ec-pdp__badge--product {
    background: rgba(0, 0, 0, 0.6);
}
.ec-pdp__badge--ai {
    background: rgba(0, 180, 255, 0.8);
}
.ec-pdp__info {
    padding: 40px 32px;
    position: sticky;
    top: 53px;
    height: fit-content;
}
.ec-pdp__back {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    color: #888;
    letter-spacing: 0.05em;
    cursor: pointer;
    border: none;
    background: none;
    margin-bottom: 16px;
    padding: 0;
}
.ec-pdp__back:hover { color: #111; }
.ec-pdp__breadcrumb {
    font-size: 9px;
    color: #aaa;
    letter-spacing: 0.05em;
    margin-bottom: 20px;
}
.ec-pdp__brand {
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.15em;
    color: #888;
    margin-bottom: 8px;
}
.ec-pdp__name {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 12px;
    line-height: 1.4;
    color: #111;
}
.ec-pdp__price {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #111;
}
.ec-pdp__label {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: #888;
    margin-bottom: 8px;
    text-transform: uppercase;
}
.ec-pdp__colors {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
}
.ec-pdp__colors span {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: border-color 0.2s;
}
.ec-pdp__colors span:first-child { border-color: #111; }
.ec-pdp__colors span:hover { border-color: #111; }
.ec-pdp__sizes {
    display: flex;
    gap: 6px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}
.ec-pdp__sizes span {
    padding: 8px 14px;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.05em;
    border: 1px solid #ddd;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s;
}
.ec-pdp__sizes span:first-child {
    border-color: #111;
    background: #111;
    color: #fff;
}
.ec-pdp__sizes span:hover { border-color: #111; }
.ec-pdp__cart {
    width: 100%;
    padding: 14px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: none;
    border-radius: 2px;
    background: #111;
    color: #fff;
    cursor: pointer;
    margin-bottom: 24px;
    transition: background 0.2s;
}
.ec-pdp__cart:hover { background: #333; }
.ec-pdp__desc {
    font-size: 11px;
    line-height: 1.8;
    color: #666;
    border-top: 1px solid #eee;
    padding-top: 20px;
}
.ec-pdp__meta {
    font-size: 9px;
    color: #aaa;
    margin-top: 16px;
    line-height: 1.8;
}

/* ======================================
   Reveal
   ====================================== */
.ec-reveal {
    background: #0a0a0f;
    padding: 6rem 2rem;
    text-align: center;
}
.ec-reveal__inner {
    max-width: 600px;
    margin: 0 auto;
    opacity: 0;
    visibility: hidden;
}
.ec-reveal__title {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.02em;
    margin-bottom: 1rem;
    line-height: 1.6;
}
.ec-reveal__sub {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.5);
    margin-bottom: 2rem;
}
.ec-reveal__cta {
    display: inline-block;
    padding: 14px 36px;
    background: #fff;
    color: #111;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 4px;
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: background 0.2s;
}
.ec-reveal__cta:hover { background: #f0f0f0; }

@media (prefers-reduced-motion: no-preference) {
    .ec-reveal__inner {
        transition: opacity 0.8s ease, visibility 0.8s ease;
    }
}
.ec-reveal.is-revealed .ec-reveal__inner {
    opacity: 1;
    visibility: visible;
}

/* ======================================
   EC Mobile
   ====================================== */
@media (max-width: 768px) {
    .ec-nav {
        padding: 12px 16px;
    }
    .ec-nav__links {
        display: none;
    }
    .ec-product-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .ec-pdp {
        grid-template-columns: 1fr;
    }
    .ec-pdp__info {
        position: static;
        padding: 24px 16px;
    }
    .ec-pdp__name {
        font-size: 16px;
    }
    .ec-pdp__price {
        font-size: 14px;
    }
    .ec-reveal__title {
        font-size: 1.2rem;
    }
}
```

- [ ] **Step 4: Verify no CSS errors — open in browser**

- [ ] **Step 5: Commit**

```bash
cd /tmp/lumina-studio-lp
git add styles.css
git commit -m "refactor: replace old LP CSS with EC site styles (nav/grid/pdp/reveal)"
```

---

### Task 3: Build product grid HTML

**Files:**
- Modify: `/tmp/lumina-studio-lp/index.html`

- [ ] **Step 1: Replace the grid placeholder with full product grid**

Find `<div class="ec-view ec-grid-view is-active" id="gridView">` and replace with:

```html
    <div class="ec-view ec-grid-view is-active" id="gridView">
        <div class="ec-grid__header"><h2>ALL ITEMS</h2></div>
        <div class="ec-product-grid">
            <div class="ec-product-card" onclick="showPDP(1)">
                <img class="ec-product-card__img" src="assets/images/generated/gen-1-bust.png" alt="Distressed Leather Zip Jacket" loading="lazy">
                <div class="ec-product-card__info">
                    <p class="ec-product-card__name">Distressed Leather Zip Jacket</p>
                    <p class="ec-product-card__price">¥385,000</p>
                </div>
            </div>
            <div class="ec-product-card" onclick="showPDP(2)">
                <img class="ec-product-card__img" src="assets/images/generated/gen-2-front.png" alt="Insulated Puff Jacket" loading="lazy">
                <div class="ec-product-card__info">
                    <p class="ec-product-card__name">Insulated Puff Jacket</p>
                    <p class="ec-product-card__price">¥168,000</p>
                </div>
            </div>
            <div class="ec-product-card" onclick="showPDP(3)">
                <img class="ec-product-card__img" src="assets/images/generated/gen-3-front.png" alt="Cotton Silk Short Parka" loading="lazy">
                <div class="ec-product-card__info">
                    <p class="ec-product-card__name">Cotton Silk Short Parka</p>
                    <p class="ec-product-card__price">¥89,000</p>
                </div>
            </div>
            <div class="ec-product-card" onclick="showPDP(4)">
                <img class="ec-product-card__img" src="assets/images/generated/gen-4-front.png" alt="Washed Canvas Work Jacket" loading="lazy">
                <div class="ec-product-card__info">
                    <p class="ec-product-card__name">Washed Canvas Work Jacket</p>
                    <p class="ec-product-card__price">¥128,000</p>
                </div>
            </div>
            <div class="ec-product-card" onclick="showPDP(5)">
                <img class="ec-product-card__img" src="assets/images/generated/gen-5-front.png" alt="Raw Selvedge Wide Denim" loading="lazy">
                <div class="ec-product-card__info">
                    <p class="ec-product-card__name">Raw Selvedge Wide Denim</p>
                    <p class="ec-product-card__price">¥38,000</p>
                </div>
            </div>
            <div class="ec-product-card" onclick="showPDP(6)">
                <img class="ec-product-card__img" src="assets/images/generated/gen-6-front.png" alt="Ombre Check Open Collar Shirt" loading="lazy">
                <div class="ec-product-card__info">
                    <p class="ec-product-card__name">Ombre Check Open Collar Shirt</p>
                    <p class="ec-product-card__price">¥16,800</p>
                </div>
            </div>
        </div>
    </div>
```

- [ ] **Step 2: Open in browser, verify 6-card grid displays**

- [ ] **Step 3: Commit**

```bash
cd /tmp/lumina-studio-lp
git add index.html
git commit -m "feat: add 6-product grid view with AI model card images"
```

---

### Task 4: Build 6 PDP views

**Files:**
- Modify: `/tmp/lumina-studio-lp/index.html`

- [ ] **Step 1: Add all 6 PDP view sections after the gridView div, before the reveal section**

Find `<!-- ========== REVEAL =========== -->` and insert before it all 6 PDP views. Each PDP follows this structure (example for Product 1):

```html
    <div class="ec-view ec-pdp-view" id="pdp-1">
        <div class="ec-pdp">
            <div class="ec-pdp__images">
                <div class="ec-pdp__img-item ec-pdp__img-item--product">
                    <img src="assets/images/products/product-1a.jpg" alt="Product flat-lay front" loading="lazy">
                    <span class="ec-pdp__badge ec-pdp__badge--product">商品画像</span>
                </div>
                <div class="ec-pdp__img-item ec-pdp__img-item--ai">
                    <img src="assets/images/generated/gen-1-bust.png" alt="AI model front" loading="lazy">
                    <span class="ec-pdp__badge ec-pdp__badge--ai">AI着用画像</span>
                </div>
                <div class="ec-pdp__img-item ec-pdp__img-item--ai">
                    <img src="assets/images/generated/gen-1-back.png" alt="AI model back" loading="lazy">
                    <span class="ec-pdp__badge ec-pdp__badge--ai">AI着用画像</span>
                </div>
                <div class="ec-pdp__img-item ec-pdp__img-item--ai">
                    <img src="assets/images/generated/gen-1-back2.png" alt="AI model detail" loading="lazy">
                    <span class="ec-pdp__badge ec-pdp__badge--ai">AI着用画像</span>
                </div>
                <div class="ec-pdp__img-item ec-pdp__img-item--product">
                    <img src="assets/images/products/product-1b.jpg" alt="Product flat-lay back" loading="lazy">
                    <span class="ec-pdp__badge ec-pdp__badge--product">商品画像</span>
                </div>
            </div>
            <div class="ec-pdp__info">
                <button class="ec-pdp__back" onclick="showGrid()">← ALL ITEMS</button>
                <p class="ec-pdp__breadcrumb">LUMINA / WOMEN / OUTERWEAR</p>
                <p class="ec-pdp__brand">LUMINA</p>
                <h1 class="ec-pdp__name">Distressed Leather Zip Jacket</h1>
                <p class="ec-pdp__price">¥385,000</p>
                <p class="ec-pdp__label">Color</p>
                <div class="ec-pdp__colors">
                    <span style="background:#2a1a0a"></span>
                    <span style="background:#111"></span>
                </div>
                <p class="ec-pdp__label">Size</p>
                <div class="ec-pdp__sizes">
                    <span>36</span><span>38</span><span>40</span><span>42</span>
                </div>
                <button class="ec-pdp__cart">カートに追加</button>
                <div class="ec-pdp__desc">
                    ヴィンテージ加工を施したディストレストレザージャケット。<br>
                    シルバートーンのジップクロージャー。フロントスラッシュポケット。<br>
                    裏地付き。日本製。
                </div>
                <div class="ec-pdp__meta">
                    品番: LM-OW-001<br>
                    素材: Cow Leather 100%<br>
                    モデル: 175cm / Size 38 着用
                </div>
            </div>
        </div>
    </div>
```

Product data for all 6:

**PDP 2 — Insulated Puff Jacket**
- Product imgs: product-2a.jpg, product-2b.jpg
- AI imgs: gen-2-front.png, gen-2-side.png, gen-2-back.png
- Breadcrumb: LUMINA / WOMEN / OUTERWEAR
- Price: ¥168,000
- Colors: #111 (black), #4a4a4a (charcoal)
- Sizes: 36, 38, 40, 42
- Desc: 軽量断熱パフジャケット。スタンドカラー。フロントジップ。サイドポケット。
- Meta: LM-OW-002 / Nylon 100%, Fill: Down 90% Feather 10% / 170cm / Size 38 着用

**PDP 3 — Cotton Silk Short Parka**
- Product imgs: product-3a.jpg (1枚のみ)
- AI imgs: gen-3-front.png, gen-3-side.png, gen-3-back.png
- Breadcrumb: LUMINA / UNISEX / OUTERWEAR
- Price: ¥89,000
- Colors: #c4b5a0 (beige), #111 (black)
- Sizes: S, M, L, XL
- Desc: コットンシルク混のショートパーカー。ドローストリングフード。フロントジップ。
- Meta: LM-OW-003 / Cotton 70%, Silk 30% / 172cm / Size M 着用

**PDP 4 — Washed Canvas Work Jacket**
- Product imgs: product-4a.jpg (1枚のみ)
- AI imgs: gen-4-front.png, gen-4-side.png, gen-4-back.png
- Breadcrumb: LUMINA / MEN / OUTERWEAR
- Price: ¥128,000
- Colors: #c4a878 (sand), #2a2a2a (black)
- Sizes: S, M, L, XL
- Desc: ウォッシュ加工キャンバスワークジャケット。チェストポケット。バックプリーツ。
- Meta: LM-OW-004 / Cotton Canvas 100% / 180cm / Size L 着用

**PDP 5 — Raw Selvedge Wide Denim**
- Product imgs: product-5a.jpg, product-5b.jpg
- AI imgs: gen-5-front.png, gen-5-side.png, gen-5-back.png
- Breadcrumb: LUMINA / UNISEX / BOTTOMS
- Price: ¥38,000
- Colors: #1a1a3e (indigo), #111 (black)
- Sizes: 1, 2, 3, 4
- Desc: 赤耳セルビッジデニム。ワイドストレートシルエット。ボタンフライ。
- Meta: LM-BT-001 / Cotton 100% (14oz Selvedge) / 175cm / Size 2 着用

**PDP 6 — Ombre Check Open Collar Shirt**
- Product imgs: product-6a.jpg, product-6b.jpg
- AI imgs: gen-6-front.png, gen-6-side.png, gen-6-back.png
- Breadcrumb: LUMINA / MEN / SHIRTS
- Price: ¥16,800
- Colors: #1a1a3e (navy/yellow), #8a3a3a (red)
- Sizes: S, M, L, XL
- Desc: オンブレチェックのオープンカラーシャツ。リラックスフィット。ボックスシルエット。
- Meta: LM-SH-001 / Cotton 100% / 178cm / Size L 着用

- [ ] **Step 2: Open in browser, verify grid still displays (PDPs hidden)**

- [ ] **Step 3: Commit**

```bash
cd /tmp/lumina-studio-lp
git add index.html
git commit -m "feat: add 6 PDP views with product + AI generated images"
```

---

### Task 5: Replace JavaScript

**Files:**
- Modify: `/tmp/lumina-studio-lp/script.js`

- [ ] **Step 1: Read script.js and identify what to keep**

Keep: FAQ accordion logic, contact form submission logic, fade-up observer (if still used by pricing/faq/contact sections).

Remove: hero slider, showcase reveal, kive UI interactions, hero dots, horizontal scroll, any code targeting removed section IDs.

- [ ] **Step 2: Remove old JS, add new SPA + reveal JS**

Remove all JS related to hero slider, showcase, kive features. Add at the top of the file (before FAQ/contact JS):

```javascript
/* ── EC Site: SPA View Switching ─────────────────────────── */
function showPDP(n) {
    document.querySelectorAll('.ec-view').forEach(function(el) {
        el.classList.remove('is-active');
    });
    var pdp = document.getElementById('pdp-' + n);
    if (pdp) {
        pdp.classList.add('is-active');
        window.scrollTo(0, 0);
    }
}

function showGrid() {
    document.querySelectorAll('.ec-view').forEach(function(el) {
        el.classList.remove('is-active');
    });
    document.getElementById('gridView').classList.add('is-active');
    window.scrollTo(0, 0);
}

/* ── Reveal Animation ────────────────────────────────────── */
(function initReveal() {
    var reveal = document.querySelector('.ec-reveal');
    if (!reveal) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                reveal.classList.add('is-revealed');
                observer.unobserve(reveal);
            }
        });
    }, {
        threshold: 0,
        rootMargin: '-30% 0px -30% 0px'
    });

    observer.observe(reveal);
})();
```

- [ ] **Step 3: Test SPA navigation**

Open in browser:
1. Grid view shows 6 products
2. Click product → PDP shows, grid hides, scrolls to top
3. Click ← ALL ITEMS → grid shows, PDP hides
4. Scroll down past PDP → reveal section fades in
5. Pricing/FAQ/Contact sections work (accordion, form)

- [ ] **Step 4: Commit**

```bash
cd /tmp/lumina-studio-lp
git add script.js
git commit -m "feat: add SPA view switching + reveal animation JS"
```

---

### Task 6: Visual QA and polish

**Files:**
- Possibly modify: `/tmp/lumina-studio-lp/index.html`, `styles.css`

- [ ] **Step 1: Desktop QA (1440px)**

Check:
- Nav displays correctly (logo left, links center, icons right)
- Grid: 3 columns, images aspect-ratio 3:4, product info below each
- PDP: images left (product flat-lay with gray bg + AI model photos), sticky info right
- Reveal: dark bg, text centered, CTA button
- Pricing/FAQ/Contact render correctly below reveal
- Footer displays correctly

- [ ] **Step 2: Mobile QA (375px)**

Check:
- Nav: logo + icons, links hidden
- Grid: 2 columns
- PDP: single column, images stack, info below
- All sections scrollable and readable

- [ ] **Step 3: Image quality check**

- Product images: not cropped, shown with contain + gray bg
- AI model images: properly covering their containers
- Badges ("商品画像" / "AI着用画像") visible and correctly colored
- All images load (check network tab)

- [ ] **Step 4: Fix any issues found**

- [ ] **Step 5: Commit**

```bash
cd /tmp/lumina-studio-lp
git add -A
git commit -m "fix: visual QA polish for EC site redesign"
```

---

### Task 7: Push and deploy

- [ ] **Step 1: Verify clean state**

```bash
cd /tmp/lumina-studio-lp
git status
git log --oneline -7
```

- [ ] **Step 2: Push**

```bash
git push origin main
```

- [ ] **Step 3: Verify on production**

Check https://lumina-studio-lp.vercel.app/:
- EC grid loads as default view
- Click any product → PDP with product + AI images
- Scroll down → reveal section
- Pricing/FAQ/Contact work
- Mobile responsive
