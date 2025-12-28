import canvasBuddha from '@/assets/products/canvas-buddha.jpg';
import crystalButterfly from '@/assets/products/crystal-butterfly.jpg';
import gearClock from '@/assets/products/gear-clock.jpg';
import tropicalWallpaper from '@/assets/products/tropical-wallpaper.jpg';
import horsesPainting from '@/assets/products/horses-painting.jpg';
import radhaKrishna from '@/assets/products/radha-krishna.jpg';
import abstractArt from '@/assets/products/abstract-art.jpg';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  categorySlug: string;
  description: string;
  rating: number;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Canvas Paintings',
    slug: 'canvas-paintings',
    image: canvasBuddha,
    description: 'Premium quality canvas wall art',
    productCount: 245
  },
  {
    id: '2',
    name: 'Crystal Glass Paintings',
    slug: 'crystal-paintings',
    image: crystalButterfly,
    description: 'Elegant crystal glass artwork',
    productCount: 128
  },
  {
    id: '3',
    name: 'Moving Gear Clocks',
    slug: 'gear-clocks',
    image: gearClock,
    description: 'Vintage style moving gear wall clocks',
    productCount: 56
  },
  {
    id: '4',
    name: 'Premium Wallpapers',
    slug: 'wallpapers',
    image: tropicalWallpaper,
    description: 'Designer wallpapers for modern homes',
    productCount: 312
  }
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Buddha Lotus Canvas Painting',
    price: 2499,
    originalPrice: 4999,
    image: canvasBuddha,
    category: 'Canvas Paintings',
    categorySlug: 'canvas-paintings',
    description: 'Beautiful Buddha canvas painting with lotus flowers, perfect for meditation rooms and living spaces.',
    rating: 4.8,
    inStock: true
  },
  {
    id: 'p2',
    name: 'Golden Butterfly Crystal Art',
    price: 3499,
    originalPrice: 5999,
    image: crystalButterfly,
    category: 'Crystal Glass Paintings',
    categorySlug: 'crystal-paintings',
    description: 'Stunning crystal glass artwork featuring golden butterfly with sparkling accents.',
    rating: 4.9,
    inStock: true
  },
  {
    id: 'p3',
    name: 'Vintage Moving Gear Wall Clock',
    price: 4999,
    originalPrice: 7999,
    image: gearClock,
    category: 'Moving Gear Clocks',
    categorySlug: 'gear-clocks',
    description: 'Steampunk style wall clock with visible moving gears, antique bronze finish.',
    rating: 4.7,
    inStock: true
  },
  {
    id: 'p4',
    name: 'Tropical Paradise Wallpaper',
    price: 1299,
    originalPrice: 2499,
    image: tropicalWallpaper,
    category: 'Premium Wallpapers',
    categorySlug: 'wallpapers',
    description: 'Vibrant tropical wallpaper with lush palm leaves and exotic flowers.',
    rating: 4.6,
    inStock: true
  },
  {
    id: 'p5',
    name: 'Seven Running Horses Painting',
    price: 2999,
    originalPrice: 5499,
    image: horsesPainting,
    category: 'Canvas Paintings',
    categorySlug: 'canvas-paintings',
    description: 'Dynamic canvas painting of seven galloping horses, brings positive energy and success.',
    rating: 4.8,
    inStock: true
  },
  {
    id: 'p6',
    name: 'Radha Krishna Divine Love',
    price: 2799,
    originalPrice: 4999,
    image: radhaKrishna,
    category: 'Canvas Paintings',
    categorySlug: 'canvas-paintings',
    description: 'Traditional Radha Krishna painting with vibrant colors and lotus flowers.',
    rating: 4.9,
    inStock: true
  },
  {
    id: 'p7',
    name: 'Abstract Gold & Teal Art',
    price: 3299,
    originalPrice: 5999,
    image: abstractArt,
    category: 'Canvas Paintings',
    categorySlug: 'canvas-paintings',
    description: 'Contemporary abstract artwork with bold gold and teal brush strokes.',
    rating: 4.5,
    inStock: true
  }
];

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return products.filter(p => p.categorySlug === categorySlug);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(c => c.slug === slug);
};
