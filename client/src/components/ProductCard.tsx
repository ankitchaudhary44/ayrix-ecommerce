'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Ruler, Truck, RotateCcw, Heart, CheckCircle2, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  fitType: string;
  brand: string;
  brandFitOffset?: number;
  returnsCount?: number;
  totalSales?: number;
  sizes: string[];
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedSize, setAddedSize] = useState<string | null>(null);
  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = (size: string) => {
    addToCart(product, size);
    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 2000);
  };

  // Fallback rating for Myntra style UI
  const rating = (4.0 + Math.random()).toFixed(1);
  const ratingCount = Math.floor(Math.random() * 1000) + 50;

  const returnRate = (product.totalSales || 0) > 0 ? ((product.returnsCount || 0) / (product.totalSales || 1)) * 100 : 0;
  
  return (
    <div 
      className="group relative flex flex-col bg-white overflow-hidden transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
        <Link href={`/shop/${product._id}`} className="block w-full h-full">
          <img 
            src={product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image'} 
            alt={product.name} 
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        
        {/* Ratings Badge (Myntra Style) */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm opacity-100 group-hover:opacity-0 transition-opacity">
          <span>{rating}</span>
          <Star className="w-2.5 h-2.5 text-teal-600 fill-teal-600" />
          <span className="text-zinc-400 pl-0.5 border-l border-zinc-300 ml-0.5">{ratingCount}</span>
        </div>

        {/* Fit Badge (AYRIX Feature embedded subtly) */}
        {product.brandFitOffset !== 0 && (
          <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider">
            Fit Offset: {(product.brandFitOffset || 0) > 0 ? `+${product.brandFitOffset}` : product.brandFitOffset}
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="p-3 flex flex-col bg-white relative z-10">
        
        {/* Wishlist Button - Absolute Positioned to overlap image on hover */}
        <button 
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          className={`absolute -top-12 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md transition-all duration-300 z-20 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-zinc-600'}`} />
        </button>

        <h3 className="text-[13px] font-bold text-zinc-800 uppercase tracking-wide truncate mb-0.5">
          {product.brand}
        </h3>
        
        <p className="text-[12px] text-zinc-500 truncate mb-1.5">
          {product.name}
        </p>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[13px] font-bold text-zinc-900">
            Rs. {Math.round(product.price * 82)}
          </span>
          <span className="text-[12px] text-zinc-400 line-through">
            Rs. {Math.round((product.price * 82) * 1.4)}
          </span>
          <span className="text-[10px] font-bold text-rose-500 uppercase">
            (40% OFF)
          </span>
        </div>

        {/* Size Selector Hover State */}
        <div className={`absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-zinc-100 transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Quick Add to Bag</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {product.sizes?.map(size => (
                <button 
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(size);
                  }}
                  className={`text-[11px] font-bold w-8 h-8 flex items-center justify-center rounded-sm transition-all ${addedSize === size ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'text-zinc-800 border border-zinc-300 hover:border-rose-500 hover:text-rose-500'}`}
                >
                  {addedSize === size ? <CheckCircle2 className="w-4 h-4" /> : size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
