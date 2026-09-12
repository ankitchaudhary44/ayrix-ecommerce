'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WishlistItem {
  id: string; // product._id
  product: any;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  toggleWishlist: (product: any) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load from local storage on initial mount
  useEffect(() => {
    const saved = localStorage.getItem('ayrix_wishlist');
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save to local storage when wishlist changes
  useEffect(() => {
    localStorage.setItem('ayrix_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product: any) => {
    setWishlistItems(prev => {
      const existing = prev.find(item => item.id === product._id);
      if (existing) {
        return prev.filter(item => item.id !== product._id);
      }
      return [...prev, { id: product._id, product }];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
