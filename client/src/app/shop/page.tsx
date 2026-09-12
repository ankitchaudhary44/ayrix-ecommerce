'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Search, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>(initialCategory);
  const [brand, setBrand] = useState<string>('');
  const [fitType, setFitType] = useState<string>('');
  const [search, setSearch] = useState<string>(initialSearch);

  const categories = ['T-shirts', 'Shirts', 'Jeans', 'Trousers', 'Hoodies'];
  const brands = ['AeroAthletics', 'UrbanCraft', 'ApexStudio', 'DenimWorks', 'HeritageThread'];
  const fitTypes = ['slim', 'regular', 'relaxed', 'oversized'];

  useEffect(() => {
    // If URL params change via Navbar click while already on /shop
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    
    if (urlCategory !== null && urlCategory !== category) {
      setCategory(urlCategory);
    }
    if (urlSearch !== null && urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [category, brand, fitType, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (brand) params.append('brand', brand);
      if (fitType) params.append('fitType', fitType);
      if (search) params.append('search', search);

      const res = await api.get<any>(`/products?${params.toString()}`);
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            Fashion Catalog
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Discover precision garments integrated with AYRIX Fit Intelligence.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-80">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search garments or brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded pl-9 pr-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            className="bg-black hover:bg-zinc-800 text-white font-bold text-xs px-4 py-2.5 rounded transition-colors shrink-0 shadow-sm"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filters:
        </span>

        <button
          onClick={() => { setCategory(''); setBrand(''); setFitType(''); setSearch(''); }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            !category && !brand && !fitType && !search
              ? 'bg-black text-white shadow-sm'
              : 'bg-white text-zinc-500 hover:text-black border border-zinc-300 hover:border-black'
          }`}
        >
          All Items
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(category === cat ? '' : cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              category === cat
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-zinc-500 hover:text-black border border-zinc-300 hover:border-black'
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="h-4 w-px bg-zinc-300 mx-1 hidden md:block"></div>

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="bg-white border border-zinc-300 text-zinc-700 rounded px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-black"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={fitType}
          onChange={(e) => setFitType(e.target.value)}
          className="bg-white border border-zinc-300 text-zinc-700 rounded px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-black"
        >
          <option value="">All Fit Cuts</option>
          {fitTypes.map((f) => (
            <option key={f} value={f}>{f.toUpperCase()} Fit</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-zinc-100 border border-zinc-200 rounded h-80 animate-pulse"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded p-12 text-center space-y-3">
          <p className="text-sm font-medium text-zinc-500">No items match your active filter criteria.</p>
          <button
            onClick={() => { setCategory(''); setBrand(''); setFitType(''); setSearch(''); }}
            className="text-xs text-black hover:underline font-bold"
          >
            Reset Catalog Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 flex items-center justify-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
