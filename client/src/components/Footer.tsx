'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 text-white/50 font-sans pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="font-bold text-xl tracking-[0.2em] uppercase text-white">AYRIX</span>
            <p className="text-[11px] leading-relaxed font-medium max-w-xs">
              AYRIX is a premier fashion technology platform providing intelligent size prediction, garment ease measurement physics, and zero-risk return protection across leading global apparel brands.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">
              Online Shopping
            </h4>
            <ul className="space-y-2.5 text-[11px] font-medium tracking-wider">
              <li><Link href="/shop?category=T-shirts" className="hover:text-white transition-colors uppercase">T-Shirts & Tops</Link></li>
              <li><Link href="/shop?category=Shirts" className="hover:text-white transition-colors uppercase">Formal & Casual Shirts</Link></li>
              <li><Link href="/shop?category=Jeans" className="hover:text-white transition-colors uppercase">Selvedge & Stretch Denim</Link></li>
              <li><Link href="/shop?category=Trousers" className="hover:text-white transition-colors uppercase">Tailored Trousers & Chinos</Link></li>
              <li><Link href="/shop?category=Hoodies" className="hover:text-white transition-colors uppercase">Hoodies & Sweatshirts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">
              Customer Care & Policies
            </h4>
            <ul className="space-y-2.5 text-[11px] font-medium tracking-wider">
              <li><Link href="/profile" className="hover:text-white transition-colors uppercase">My Fit Profile</Link></li>
              <li><Link href="/purchases" className="hover:text-white transition-colors uppercase">Order History</Link></li>
              <li><Link href="/policies/guarantee" className="hover:text-white transition-colors uppercase">Perfect Fit Guarantee</Link></li>
              <li><Link href="/policies/size-guide" className="hover:text-white transition-colors uppercase">Size Guide & Ease Specs</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-white transition-colors uppercase">Privacy & Data Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">
              AYRIX Promise
            </h4>
            <div className="space-y-3 text-[10px] uppercase tracking-widest">
              <div className="flex items-center space-x-2.5 border-b border-white/5 pb-2">
                <span>100% Original Brand Assured</span>
              </div>
              <div className="flex items-center space-x-2.5 border-b border-white/5 pb-2">
                <span>Hassle-Free Fit Returns</span>
              </div>
              <div className="flex items-center space-x-2.5 border-b border-white/5 pb-2">
                <span>256-Bit Encrypted Security</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[10px] gap-4 uppercase tracking-widest">
          <div>
            &copy; {new Date().getFullYear()} AYRIX Fashion Engine Inc. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-white/30">
            <Link href="/policies/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/policies/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/policies/security" className="hover:text-white transition-colors">Security Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
