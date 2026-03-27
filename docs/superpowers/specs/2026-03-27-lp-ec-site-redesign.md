# LP → LUMINA EC Site Redesign — Design Spec

## Summary

Rebuild the LUMINA STUDIO LP as a realistic fashion EC site. Visitors see what appears to be a working online store (product grid + product detail pages). The model wearing photos are all AI-generated from flat-lay product images. A reveal moment exposes that every model photo was created by AI. Below the EC site section, existing Pricing/FAQ/Contact sections are preserved for lead generation.

**Goal:** "This looks like a real fashion brand's online store... wait, every model photo is AI?"

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| LP structure | EC site (top) + sales LP (bottom) | Demonstrate capability AND convert leads |
| Navigation | SPA-style JS view switching | Feels like real EC, no extra HTML files |
| Brand name | LUMINA | Our own brand, no IP issues |
| Product grid | 3-column, AI model photos as cards | NEIGHBORHOOD/Balenciaga reference |
| PDP layout | NEIGHBORHOOD-style: images left (vertical scroll), sticky info right | Most common high-end EC pattern |
| PDP image order | Product flat-lay FIRST → AI model wearing photos | Shows "input → output" story |
| Image badges | "商品画像" (dark) / "AI着用画像" (cyan) | Subtle but visible Before/After |
| Reveal | After browsing PDP, scrolling down triggers reveal section | Natural discovery moment |
| Below reveal | Existing Pricing, FAQ, Contact sections | Sales funnel preserved |

## Target

- **Repo:** `lumina-studio-lp` (at `/tmp/lumina-studio-lp`)
- **Files:** `index.html`, `styles.css`, `script.js`
- **Deploy:** https://lumina-studio-lp.vercel.app/
- **Assets:** `assets/images/products/` (flat-lay), `assets/images/generated/` (AI model photos)

## Page Structure

```
┌─────────────────────────────────────┐
│ NAV: LUMINA | WOMEN MEN COLLECTION  │  ← sticky
│      ABOUT | 検索 カート(0)          │
├─────────────────────────────────────┤
│                                     │
│  VIEW: Product Grid (default)       │
│  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ AI  │ │ AI  │ │ AI  │          │
│  │model│ │model│ │model│  3-col   │
│  │     │ │     │ │     │          │
│  ├─────┤ ├─────┤ ├─────┤          │
│  │name │ │name │ │name │          │
│  │price│ │price│ │price│          │
│  └─────┘ └─────┘ └─────┘          │
│  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ ... │ │ ... │ │ ... │  x6      │
│  └─────┘ └─────┘ └─────┘          │
│                                     │
├─ ─ ─ ─ ─ click ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
│                                     │
│  VIEW: PDP (JS toggle, no reload)   │
│  ┌──────────────┬──────────────┐   │
│  │ 商品画像(平置)│ ← ALL ITEMS  │   │
│  │              │ LUMINA       │   │
│  ├──────────────┤ Product Name │   │
│  │ AI着用(front)│ ¥XX,XXX     │   │
│  │              │ Color: ● ●  │   │
│  ├──────────────┤ Size: S M L │   │
│  │ AI着用(back) │ [カートに追加]│   │
│  │              │ 商品説明...  │   │
│  ├──────────────┤ (sticky)     │   │
│  │ AI着用(side) │              │   │
│  ├──────────────┤              │   │
│  │ 商品画像(back)│              │   │
│  └──────────────┴──────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ REVEAL SECTION                      │
│ "全てのモデル着用画像は              │
│  AIが生成しました。"                 │
│ CTA: 無料で5枚試す                  │
├─────────────────────────────────────┤
│ PRICING (existing)                  │
├─────────────────────────────────────┤
│ FAQ (existing)                      │
├─────────────────────────────────────┤
│ CONTACT (existing)                  │
├─────────────────────────────────────┤
│ FOOTER (existing)                   │
└─────────────────────────────────────┘
```

## Navigation

- Logo: `LUMINA` — left, font-weight:700, letter-spacing:0.2em
- Links: `WOMEN` `MEN` `COLLECTION` `ABOUT` — center
- Icons: 検索, カート(0) — right
- Sticky top, white background, 1px bottom border
- Same nav for both grid and PDP views

## Product Grid View

- Section class: `.ec-grid-view`
- Header: "ALL ITEMS" — small, centered, uppercase, letter-spacing
- Grid: `grid-template-columns: repeat(3, 1fr)`, gap: 2px
- Max-width: 1200px, centered
- Mobile (< 768px): 2 columns

### Product Card

- Image: AI model wearing photo (front), aspect-ratio 3/4, object-fit: cover
- Below image: product name (10px, weight 500) + price (10px, color #666)
- White background on info area
- Hover: subtle opacity change on image
- Click: `onclick="showPDP(n)"` — switches to PDP view

### 6 Products

| # | Name | Price | Grid Image | Product Images | AI Generated Images |
|---|------|-------|------------|----------------|-------------------|
| 1 | Distressed Leather Zip Jacket | ¥385,000 | gen-1-bust.png | product-1a.jpg, product-1b.jpg | gen-1-bust.png, gen-1-back.png, gen-1-back2.png |
| 2 | Insulated Puff Jacket | ¥168,000 | gen-2-front.png | product-2a.jpg, product-2b.jpg | gen-2-front.png, gen-2-side.png, gen-2-back.png |
| 3 | Cotton Silk Short Parka | ¥89,000 | gen-3-front.png | product-3a.jpg | gen-3-front.png, gen-3-side.png, gen-3-back.png |
| 4 | Washed Canvas Work Jacket | ¥128,000 | gen-4-front.png | product-4a.jpg | gen-4-front.png, gen-4-side.png, gen-4-back.png |
| 5 | Raw Selvedge Wide Denim | ¥38,000 | gen-5-front.png | product-5a.jpg, product-5b.jpg | gen-5-front.png, gen-5-side.png, gen-5-back.png |
| 6 | Ombre Check Open Collar Shirt | ¥16,800 | gen-6-front.png | product-6a.jpg, product-6b.jpg | gen-6-front.png, gen-6-side.png, gen-6-back.png |

## PDP View

Triggered by clicking a product card. JS hides grid view, shows PDP view. `window.scrollTo(0,0)`.

### Layout

- 2-column grid: `grid-template-columns: 1fr 1fr`
- Left: images, vertical scroll
- Right: product info, `position: sticky; top: 53px`
- Max-width: 1200px, centered
- Mobile (< 768px): single column, info below images

### Left: Image List (vertical)

Images stacked vertically with 2px gap. Each image is full-width. Order:

1. **Product flat-lay (front)** — badge: "商品画像"
2. **AI model wearing (front)** — badge: "AI着用画像"
3. **AI model wearing (back)** — badge: "AI着用画像"
4. **AI model wearing (side/bust)** — badge: "AI着用画像"
5. **Product flat-lay (back)** — badge: "商品画像" (if available)

Product images: `object-fit: contain`, light gray background (#f5f5f5), padding 8px
AI model images: `object-fit: cover`, no padding

### Badges

- Position: absolute, bottom-left of each image
- "商品画像": background rgba(0,0,0,0.6), white text
- "AI着用画像": background rgba(0,180,255,0.8), white text
- Font: 8px, weight 600, letter-spacing 0.05em

### Right: Product Info (sticky)

Per NEIGHBORHOOD analysis, top to bottom:

1. **Back button**: `← ALL ITEMS` — returns to grid view
2. **Breadcrumb**: `LUMINA / CATEGORY / SUBCATEGORY` — 9px, gray
3. **Brand**: `LUMINA` — 10px, letter-spacing 0.15em, gray
4. **Product name**: 18px, weight 500
5. **Price**: 16px, weight 600
6. **Color label**: "Color" — 9px, uppercase
7. **Color swatches**: 24px circles, first selected (black border)
8. **Size label**: "Size" — 9px, uppercase
9. **Size buttons**: padding 8px 14px, first selected (black bg, white text)
10. **Cart button**: full-width, black bg, white text, uppercase, 11px
11. **Description**: 11px, gray, border-top
12. **Meta**: 9px, gray (品番, 素材, モデル着用サイズ)

## Reveal Section

Appears below the EC site section (always visible, not gated by PDP). Triggered by IntersectionObserver when scrolled into view.

- Dark background (#0a0a0f)
- Center text: "全てのモデル着用画像は、AIが生成しました。" — Inter 700, 1.5rem, white
- Sub text: "商品画像をアップロードするだけ。撮影コスト¥0。" — 0.9rem, white 50%
- CTA: "無料で5枚試す" → https://lumina-model-agency.vercel.app/studio
- Animation: fade-in on scroll, one-shot

## Existing Sections (preserved)

Below the reveal, keep existing sections in order:
- Pricing (#pricing)
- FAQ (#faq)
- Contact (#contact)
- Footer

Remove these old sections:
- Old Hero slider (#heroSlider)
- Old EC Showcase (#showcase)
- Problems (#problems)
- How it works (#how-it-works)
- Mid CTA
- Why LUMINA (#why-lumina)
- AIモデル紹介 (#production)
- Final CTA

## JavaScript

SPA view switching:
```
showPDP(n) — hide gridView, show pdp-N, scrollTo top
showGrid() — hide all PDPs, show gridView, scrollTo top
```

Reveal: IntersectionObserver, threshold:0, rootMargin:"-30% 0px", one-shot.

## CSS Architecture

```css
/* Nav */
.ec-nav { }

/* Grid View */
.ec-grid-view { }
.ec-grid__header { }
.ec-product-grid { }
.ec-product-card { }

/* PDP View */
.ec-pdp-view { }
.ec-pdp { }
.ec-pdp__images { }
.ec-pdp__img-item { }
.ec-pdp__badge { }
.ec-pdp__info { }
/* ... sub-elements */

/* Reveal */
.ec-reveal { }

/* View switching */
.ec-view { display: none; }
.ec-view.is-active { display: block; }
```

## Mobile (< 768px)

- Grid: 3 col → 2 col
- PDP: 2 col → 1 col (images full-width, info below)
- Nav: hamburger menu (if time permits, otherwise keep horizontal)

## Performance

- Product images: 10 files, ~100-800KB each (already in repo)
- Generated images: 18 files, ~600-900KB each (already in repo)
- Lazy loading on all images: `loading="lazy"`
- Only grid view images load initially; PDP images load when view switches

## What Gets Removed

- Hero slider section (#heroSlider) and all slide HTML/CSS/JS
- Old EC Showcase section (#showcase) — already replaced
- Problems section (#problems)
- How it works / Features sections (#how-it-works, #features)
- Mid CTA section
- Why LUMINA section (#why-lumina)
- AI Model introduction section (#production)
- Final CTA section
- All CSS for removed sections
- Hero slider JS in script.js

## What Gets Preserved

- Pricing section (#pricing) — HTML + CSS
- FAQ section (#faq) — HTML + CSS + JS (accordion)
- Contact section (#contact) — HTML + CSS + JS (form submit)
- Footer — HTML + CSS
- Google Analytics / Ads tags
- JSON-LD structured data (update to reflect new page structure)
- Vercel config
