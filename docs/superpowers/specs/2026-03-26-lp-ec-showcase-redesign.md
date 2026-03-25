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
- **Deploy:** https://lumina-studio-lp.vercel.app/
- **Assets:** Existing `assets/images/hero-models/` (sofia.png, harin.png, taku.png, marco.png, miku.png, ren.png)

## Section Structure

```
1. Section header (minimal — small label only, grid speaks for itself)
2. 2x3 browser-window grid (main content)
3. Scroll trigger → dark overlay + reveal text
4. Sub-text + CTA button
```

### Mobile (< 768px)

2 columns → 1 column. Each card full-width, vertical scroll.

## 6 Brands

| # | Brand | Style Reference | Background | Model | Genre |
|---|-------|----------------|------------|-------|-------|
| 1 | VAILLANT | Balenciaga / dark avant-garde | #0a0a0a | SOFIA (sofia.png) | Women's high fashion |
| 2 | Maison Elise | AESTHETIC / warm luxury | #faf8f5 | HARIN (harin.png) | Women's contemporary |
| 3 | DSTRKT | DOLENGA / streetwear | #f5f5f5 | TAKU (taku.png) | Men's street |
| 4 | ZAYNE | ZANEROBS / casual street | #f0ece5 | MARCO (marco.png) | Men's casual |
| 5 | NORIKO TOKYO | Japanese minimal | #fafafa | MIKU (miku.png) | Women's JP minimal |
| 6 | RVLT Supply | Nike-NB / athleisure | #1a1a2e | REN (ren.png) | Unisex athleisure |

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

### Styling per brand

Each brand has a unique:
- Color palette (background, text, borders)
- Typography (serif vs sans-serif, weight, letter-spacing)
- Nav layout (centered vs left-aligned)
- Hero composition (image position, overlay text style)
- Product grid (3-col vs 4-col, gap, border-radius)

### Browser frame

- Border-radius: 12px
- Box-shadow: `0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)`
- Top bar: 3 dots + monospace URL
- Dark brands: dark bar (#1a1a1a), Light brands: light bar (#f0ebe5 etc.)

## Reveal Animation

**Trigger:** IntersectionObserver on the grid container. When the grid has been scrolled past ~70%, trigger the overlay.

**Animation:**
1. All 6 cards simultaneously get a dark overlay: `rgba(0,0,0,0.75)`
2. Transition: `opacity 0.8s ease`
3. Center text fades in (0.3s delay after overlay):
   - "Every model on these pages is AI-generated."
   - Font: Inter 700, ~1.5rem, white, letter-spacing 0.02em
4. Below the grid, sub-text fades in:
   - Japanese: "撮影コスト¥0。あなたのブランドでも。"
5. CTA button fades in (0.5s delay):
   - "無料で5枚試す" → links to https://lumina-model-agency.vercel.app/studio

**One-shot:** Animation triggers once. No replay on scroll-up.

## CSS Architecture

All styles scoped inside the `#showcase` section. No global CSS pollution.

```css
.ec-showcase { /* grid container */ }
.ec-browser { /* browser frame */ }
.ec-browser--dark { /* dark variant */ }
.ec-browser--warm { /* warm variant */ }
/* ... per-brand modifiers */
.ec-browser__bar { /* top bar */ }
.ec-browser__page { /* page content */ }
.ec-browser__nav { /* nav inside page */ }
.ec-browser__hero { /* hero image area */ }
.ec-browser__products { /* product grid */ }
.ec-browser__footer { /* mini footer */ }
.ec-showcase__overlay { /* reveal overlay */ }
.ec-showcase__reveal-text { /* center text */ }
```

## JavaScript

Minimal. Only:
1. IntersectionObserver for reveal trigger
2. Class toggle (`.is-revealed`) on the grid container
3. No libraries. Vanilla JS.

## Performance

- No new images required — reuses existing hero-models/ (6 PNGs, ~600KB each, already cached)
- Product grid uses CSS placeholder rectangles, not images
- Total new code: ~200 lines HTML + ~300 lines CSS + ~20 lines JS
- No build step needed (static HTML site)

## What Gets Removed

The current `#showcase` section (lines ~206-347 in index.html):
- 6 ec-page cards with horizontal scroll
- Brand name mockups (BOTTEGA VENETA, MIU MIU, etc.)
- `.showcase-scroll` horizontal container
- Associated CSS in styles.css

## What Stays

- Section position in the page (after Hero, before Features)
- `id="showcase"` for nav anchor
- Existing hero-model images

## Out of Scope

- Other LP sections (hero, features, pricing, etc.) — unchanged
- New model image generation
- Mobile-specific animations (reveal works the same, just 1-col)
