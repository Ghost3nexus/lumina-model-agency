# LP EC Showcase Redesign — Design Spec

## Summary

Replace the current EC Showcase section on the LUMINA STUDIO LP with a 2-column x 3-row grid of realistic browser-window mockups. Each window contains a fictional fashion brand's EC top page, built entirely in HTML/CSS. The model photos inside are LUMINA's existing AI-generated images. A scroll-triggered overlay reveals that every model is AI-generated.

**Goal:** Visitors see professional fashion EC sites and think they're real — then discover every model photo is AI.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Grid layout | 2col x 3row (6 brands) | iOS friendly, cards large enough for UI detail |
| Page type | All top pages | Maximum visual impact |
| Reveal | Scroll-triggered overlay | "See then surprise" effect |
| Brands | 6 fictional, covering 6 genres | Show versatility |
| Implementation | HTML/CSS recreation | Retina-sharp, responsive, lightweight, easy to update model images |

## Target

- **File:** `lumina-studio-lp` repo — replaces `#showcase` section in `index.html`
- **CSS file:** `styles.css` (replace existing showcase CSS ~lines 597-792)
- **JS file:** `script.js` (add IntersectionObserver at end)
- **Deploy:** https://lumina-studio-lp.vercel.app/
- **Assets:** Existing `assets/images/hero-models/` (sofia.png, harin.png, taku.png, marco.png, miku.png, ren.png)

## Section Structure

```
1. Section header — label: "AI-Powered EC Pages"
2. 2x3 browser-window grid (main content)
3. Scroll trigger → single overlay spanning entire grid + reveal text
4. Sub-text + CTA button (always in DOM, opacity:0 until reveal)
```

### Section Header

Minimal. One small label above the grid:
- Label text: `"AI-Powered EC Pages"`
- No h2, no description paragraph. The grid speaks for itself.

### Mobile (< 768px)

2 columns → 1 column. Each card full-width, vertical scroll.

## 6 Brands

| # | Brand | Style Reference | Background | Model | Genre | Font | Weight / Spacing |
|---|-------|----------------|------------|-------|-------|------|-----------------|
| 1 | VAILLANT | Balenciaga / dark avant-garde | #0a0a0a | SOFIA (sofia.png) | Women's high fashion | Inter | 700 / 0.15em |
| 2 | Maison Elise | AESTHETIC / warm luxury | #faf8f5 | HARIN (harin.png) | Women's contemporary | Georgia, serif italic | 400 / 0.05em |
| 3 | DSTRKT | DOLENGA / streetwear | #f5f5f5 | TAKU (taku.png) | Men's street | Inter | 800 / 0.15em |
| 4 | ZAYNE | ZANEROBS / casual street | #f0ece5 | MARCO (marco.png) | Men's casual | Inter | 600 / 0.08em |
| 5 | NORIKO TOKYO | Japanese minimal | #fafafa | MIKU (miku.png) | Women's JP minimal | Inter | 400 / 0.25em |
| 6 | RVLT Supply | Nike-NB / athleisure | #1a1a2e | REN (ren.png) | Unisex athleisure | Inter | 800 italic / 0.05em |

## Grid Layout

- Container: use existing `.container` class (max-width ~1200px)
- Grid: `grid-template-columns: 1fr 1fr`
- Gap: `24px`
- All 6 cards same fixed height: `500px` with `overflow: hidden` on `.ec-browser__page`
- Mobile (< 768px): `grid-template-columns: 1fr`, card height `450px`

## Browser Window Anatomy

Each card is a browser-window frame containing a mini EC top page:

```
+--[dots]---[url-bar: brand.com]--+
| Nav: LOGO | links               |
| Hero: model image (16:10)       |
|   + overlay text (collection)   |
| Product grid (3-4 items)        |
|   (placeholder rectangles)      |
| Footer: brand copyright         |
+---------------------------------+
```

### Hero image constraint

Model images are portrait-orientation (full-body). Use `object-fit: contain` with the brand's background color behind, never `object-fit: cover` (would severely crop faces). Add `loading="lazy"` to each `<img>`.

### Styling per brand

Each brand has a unique:
- Color palette (background, text, borders)
- Typography (see table above)
- Nav layout (centered vs left-aligned)
- Hero composition (image position, overlay text style)
- Product grid (3-col vs 4-col, gap, border-radius)

### Browser frame

- Border-radius: 12px
- Box-shadow: `0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)`
- Top bar: 3 dots + monospace URL
- Dark brands (VAILLANT): bar `#1a1a1a`
- Navy brands (RVLT Supply): bar `#12122a`
- Light brands: bar matches brand background lightened (e.g. `#f0ebe5`)

## Reveal Animation

**Trigger:** IntersectionObserver on the grid container with `threshold: 0` and `rootMargin: "-30% 0px -30% 0px"`. Fires when the grid's top edge passes 30% down the viewport — reliable on both desktop and mobile regardless of grid height.

**DOM structure:** A single `.ec-showcase__overlay` div spans the entire `.ec-showcase__grid` container (not per-card). The sub-text and CTA are always in the DOM with `opacity: 0; visibility: hidden` pre-reveal, avoiding CLS.

**Animation:**
1. `.ec-showcase__grid` gets class `.is-revealed`
2. Single overlay fades in over entire grid: `rgba(0,0,0,0.75)`, `opacity 0.8s ease`
3. Center text fades in (0.3s delay after overlay):
   - "Every model on these pages is AI-generated."
   - Font: Inter 700, ~1.5rem, white, letter-spacing 0.02em
4. Below the grid, sub-text fades in:
   - "撮影コスト¥0。あなたのブランドでも。"
5. CTA button fades in (0.5s delay):
   - "無料で5枚試す" → links to https://lumina-model-agency.vercel.app/studio

**One-shot:** Animation triggers once. No replay on scroll-up.

**Reduced motion:** All transitions wrapped in `@media (prefers-reduced-motion: no-preference)`. With reduced motion, `.is-revealed` applies instantly (no transition).

## CSS Architecture

All styles scoped inside the `#showcase` section in `styles.css`. No global CSS pollution. BEM naming:

```css
.ec-showcase { /* section wrapper */ }
.ec-showcase__grid { /* 2-col grid container, position: relative */ }
.ec-browser { /* browser frame */ }
.ec-browser--dark { /* dark variant (VAILLANT) */ }
.ec-browser--warm { /* warm variant (Maison Elise, ZAYNE) */ }
.ec-browser--light { /* light variant (DSTRKT, NORIKO TOKYO) */ }
.ec-browser--navy { /* navy variant (RVLT Supply) */ }
.ec-browser__bar { /* top bar with dots + URL */ }
.ec-browser__page { /* page content, overflow: hidden, height constrained */ }
.ec-browser__nav { /* nav inside page */ }
.ec-browser__hero { /* hero image area */ }
.ec-browser__hero img { /* object-fit: contain */ }
.ec-browser__products { /* product grid */ }
.ec-browser__footer { /* mini footer */ }
.ec-showcase__overlay { /* single overlay spanning grid, position: absolute */ }
.ec-showcase__reveal-text { /* center text inside overlay */ }
.ec-showcase__cta { /* sub-text + button below grid */ }
```

## JavaScript

Minimal. Add to end of `script.js`:
1. IntersectionObserver with `threshold: 0`, `rootMargin: "-30% 0px -30% 0px"`
2. On intersect: add `.is-revealed` to `.ec-showcase__grid`
3. `observer.unobserve()` after trigger (one-shot)
4. No libraries. Vanilla JS.

## Performance

- No new images required — reuses existing hero-models/ (6 PNGs, ~600KB each, already cached from hero slider)
- All in-card `<img>` tags use `loading="lazy"`
- Product grid uses CSS placeholder rectangles, not images
- Total new code: ~250 lines HTML + ~350 lines CSS + ~15 lines JS
- No build step needed (static HTML site)

## What Gets Removed

The current `#showcase` section (lines ~206-347 in index.html):
- 6 ec-page cards with horizontal scroll
- Brand name mockups (BOTTEGA VENETA, MIU MIU, etc.)
- `.showcase-scroll` horizontal container
- `.showcase-footnote` paragraph
- Associated CSS in styles.css (~lines 597-792)

## What Stays

- Section position in the page (after Hero, before Features)
- `id="showcase"` for nav anchor
- Existing hero-model images

## Out of Scope

- Other LP sections (hero, features, pricing, etc.) — unchanged
- New model image generation
