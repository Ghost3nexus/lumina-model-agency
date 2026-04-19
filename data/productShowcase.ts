/**
 * productShowcase.ts — EC product page examples.
 *
 * Mirrors lumina-studio-lp.vercel.app product showcase. 6 brands × 5 shots
 * (front / side / back / detail + flat-lay product.jpg) = 30 assets total.
 * Used by /for-brands gallery to communicate "actual EC deliverables" volume.
 */

export interface ShowcaseProduct {
  id: string;
  name: { en: string; ja: string };
  brand: string;
  category: { en: string; ja: string };
  price: string;
  images: {
    front: string;
    side: string;
    back: string;
    detail: string;
    product: string;
  };
}

export const SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    id: 'bottega',
    name: { en: 'Napa Leather Biker Jacket', ja: 'ナパレザー バイカージャケット' },
    brand: 'Bottega Veneta',
    category: { en: 'Outerwear', ja: 'アウター' },
    price: '¥495,000',
    images: {
      front: '/showcase/bottega-front.png',
      side: '/showcase/bottega-side.png',
      back: '/showcase/bottega-back.png',
      detail: '/showcase/bottega-detail.png',
      product: '/showcase/bottega-product.jpg',
    },
  },
  {
    id: 'miumiu',
    name: { en: 'Cashmere Crewneck Sweater', ja: 'カシミヤ クルーネックセーター' },
    brand: 'Miu Miu',
    category: { en: 'Knitwear', ja: 'ニット' },
    price: '¥198,000',
    images: {
      front: '/showcase/miumiu-front.png',
      side: '/showcase/miumiu-side.png',
      back: '/showcase/miumiu-back.png',
      detail: '/showcase/miumiu-detail.png',
      product: '/showcase/miumiu-product.jpg',
    },
  },
  {
    id: 'noah',
    name: { en: 'Shore Coat', ja: 'ショアコート' },
    brand: 'Noah',
    category: { en: 'Outerwear', ja: 'アウター' },
    price: '$348',
    images: {
      front: '/showcase/noah-front.png',
      side: '/showcase/noah-side.png',
      back: '/showcase/noah-back.png',
      detail: '/showcase/noah-detail.png',
      product: '/showcase/noah-product.jpg',
    },
  },
  {
    id: 'nb',
    name: { en: 'Denim Trucker Jacket', ja: 'デニム トラッカージャケット' },
    brand: 'New Balance',
    category: { en: 'Outerwear', ja: 'アウター' },
    price: '¥19,800',
    images: {
      front: '/showcase/nb-front.png',
      side: '/showcase/nb-side.png',
      back: '/showcase/nb-back.png',
      detail: '/showcase/nb-detail.png',
      product: '/showcase/nb-product.jpg',
    },
  },
  {
    id: 'zara',
    name: { en: 'TRF Wide Leg High Rise Denim', ja: 'TRF ワイドレッグ ハイライズデニム' },
    brand: 'Zara',
    category: { en: 'Bottoms', ja: 'ボトムス' },
    price: '¥5,990',
    images: {
      front: '/showcase/zara-front.png',
      side: '/showcase/zara-side.png',
      back: '/showcase/zara-back.png',
      detail: '/showcase/zara-detail.png',
      product: '/showcase/zara-product.jpg',
    },
  },
  {
    id: 'nike',
    name: { en: 'Club Fleece Half-Zip Pullover', ja: 'クラブフリース ハーフジップ' },
    brand: 'Nike',
    category: { en: 'Sportswear', ja: 'スポーツウェア' },
    price: '¥8,250',
    images: {
      front: '/showcase/nike-front.png',
      side: '/showcase/nike-side.png',
      back: '/showcase/nike-back.png',
      detail: '/showcase/nike-detail.png',
      product: '/showcase/nike-product.jpg',
    },
  },
];
