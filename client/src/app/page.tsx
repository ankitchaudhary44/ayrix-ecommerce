'use client';

import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { ShieldCheck, ArrowRight, Sparkles, ShoppingBag, Truck, RotateCcw, BadgeCheck } from 'lucide-react';

import { api } from '@/lib/api';

const categories = [
  { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&auto=format&fit=crop' },
  { name: 'Shirts', image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=300&auto=format&fit=crop' },
  { name: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&auto=format&fit=crop' },
  { name: 'Hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&auto=format&fit=crop' },
  { name: 'Jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&auto=format&fit=crop' },
  { name: 'Trousers', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&auto=format&fit=crop' },
];

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop',
    tagline: 'End of Reason Sale',
    title: 'THE BIG\nFASHION FESTIVAL',
    subtitle: '50-80% OFF on premium global brands. Discover your perfect style and exact fit.'
  },
  {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
    tagline: 'New Arrivals',
    title: 'WINTER\nCOLLECTION',
    subtitle: 'Explore the latest trends in outerwear and cozy layers.'
  },
  {
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
    tagline: 'Exclusive Deals',
    title: 'STREETWEAR\nESSENTIALS',
    subtitle: 'Upgrade your everyday look with our curated streetwear drops.'
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
    tagline: 'Limited Time',
    title: 'LUXURY\nREDEFINED',
    subtitle: 'Premium tailored fits for the modern professional.'
  }
];

export default function HomePage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get<any>('/products');
        setProducts(res.products?.slice(0, 8) || []);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans pb-20">
      
      {/* 1. Fashion Hero Banner Carousel */}
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] bg-zinc-900 overflow-hidden group">
        {heroSlides.map((slide, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover object-center opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
                <div className="max-w-xl space-y-4">
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase rounded-sm inline-block mb-2">
                    {slide.tagline}
                  </span>
                  <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-none whitespace-pre-line">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-zinc-300 font-medium pb-4">
                    {slide.subtitle}
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-white text-zinc-900 hover:bg-zinc-100 transition-colors px-8 py-3.5 text-sm font-bold uppercase tracking-widest"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 transition-all duration-300 rounded-full ${currentSlide === idx ? 'w-8 bg-white' : 'w-4 bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. The "Advanced Feature" Banner (AYRIX Engine) */}
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                Powered by AYRIX Fit Engine <Sparkles className="w-3 h-3 text-indigo-500" />
              </h3>
              <p className="text-xs text-zinc-500 font-medium">Zero-Return Confidence. AI predicts your exact size based on body geometry.</p>
            </div>
          </div>
          <Link href="/profile" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1">
            Setup Fit Profile <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* 3. Shop by Category (Circular) */}
      <section className="max-w-7xl mx-auto px-6 pt-16">
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase mb-8">Categories to Bag</h2>
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {categories.map((cat, idx) => (
            <Link key={idx} href={`/shop?category=${cat.name}`} className="flex flex-col items-center gap-3 min-w-[100px] group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 p-1 group-hover:border-rose-500 transition-colors">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110" />
              </div>
              <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-widest group-hover:text-rose-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending Products */}
      <section className="max-w-7xl mx-auto px-6 pt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Trending Now</h2>
            <p className="text-sm text-zinc-500 mt-1 font-medium">Bestselling styles with guaranteed fit.</p>
          </div>
          <Link href="/shop" className="text-xs font-bold text-zinc-500 hover:text-rose-600 uppercase tracking-widest flex items-center gap-1 transition-colors hidden sm:flex">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            <div className="col-span-4 text-center py-10 text-zinc-500 font-bold uppercase tracking-widest text-xs">
              Fetching Real-Time Catalog...
            </div>
          ) : (
            products.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))
          )}
        </div>
      </section>

      {/* 5. Value Propositions */}
      <section className="max-w-7xl mx-auto px-6 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-zinc-200 pt-10">
          <div className="flex items-center gap-4">
            <BadgeCheck className="w-8 h-8 text-zinc-700 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-zinc-900 uppercase">100% Original</h4>
              <p className="text-xs text-zinc-500 font-medium">Guarantee for all products at ayrix.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RotateCcw className="w-8 h-8 text-zinc-700 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-zinc-900 uppercase">Return within 14 days</h4>
              <p className="text-xs text-zinc-500 font-medium">Of receiving your order</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Truck className="w-8 h-8 text-zinc-700 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-zinc-900 uppercase">Free Delivery</h4>
              <p className="text-xs text-zinc-500 font-medium">On all orders above Rs. 999</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
