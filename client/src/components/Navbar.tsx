'use client';
import { useRouter } from "next/navigation";


import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { ShoppingBag, User, LogOut, Search, Heart, Moon, Sun, HelpCircle } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { SupportModal } from './SupportModal';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200 text-black font-sans shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center group mr-8">
          <span className="font-extrabold text-2xl tracking-[0.1em] text-black uppercase group-hover:opacity-80 transition-opacity">
            AYRIX
          </span>
        </Link>

        {/* NAVIGATION LINKS (Myntra Style) */}
        <nav className="hidden md:flex flex-grow items-center space-x-8">
          <Link href="/shop?category=T-shirts" className="text-[13px] font-bold text-zinc-800 hover:text-black uppercase tracking-wider transition-colors border-b-2 border-transparent hover:border-black pb-1">
            T-Shirts
          </Link>
          <Link href="/shop?category=Shirts" className="text-[13px] font-bold text-zinc-800 hover:text-black uppercase tracking-wider transition-colors border-b-2 border-transparent hover:border-black pb-1">
            Shirts
          </Link>
          <Link href="/shop?category=Jeans" className="text-[13px] font-bold text-zinc-800 hover:text-black uppercase tracking-wider transition-colors border-b-2 border-transparent hover:border-black pb-1">
            Denim
          </Link>
          <Link href="/shop?category=Trousers" className="text-[13px] font-bold text-zinc-800 hover:text-black uppercase tracking-wider transition-colors border-b-2 border-transparent hover:border-black pb-1">
            Trousers
          </Link>
          <Link href="/shop?category=Hoodies" className="text-[13px] font-bold text-zinc-800 hover:text-black uppercase tracking-wider transition-colors border-b-2 border-transparent hover:border-black pb-1">
            Hoodies
          </Link>
          
          {user?.role === 'product_manager' && (
            <Link href="/pm/dashboard" className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded uppercase tracking-wider transition-colors hover:bg-indigo-100 ml-4">
              PM Dashboard
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link href="/admin/dashboard" className="text-[11px] font-bold bg-rose-50 text-rose-700 px-3 py-1.5 rounded uppercase tracking-wider transition-colors hover:bg-rose-100 ml-4">
              Admin Portal
            </Link>
          )}
        </nav>


        {/* SEARCH BAR (Myntra Style) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search for products, brands and more"
              className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded bg-zinc-50 text-[13px] placeholder-zinc-500 focus:outline-none focus:bg-white focus:border-zinc-300 transition-colors"
            />
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center space-x-6 ml-4">
          {user ? (
            <div className="flex items-center space-x-6">
              <button 
                onClick={toggleTheme}
                className="flex flex-col items-center justify-center text-zinc-700 hover:text-black transition-colors group"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 mb-0.5" /> : <Moon className="w-5 h-5 mb-0.5" />}
                <span className="text-[10px] font-bold uppercase tracking-wider">Theme</span>
              </button>

              <button 
                onClick={() => setIsSupportModalOpen(true)}
                className="flex flex-col items-center justify-center text-zinc-700 hover:text-black transition-colors group"
                title="Support"
              >
                <HelpCircle className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Support</span>
              </button>

              <NotificationBell />

              <Link href="/wallet" className="flex flex-col items-center justify-center text-zinc-700 hover:text-black transition-colors group">
                <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Wallet</span>
              </Link>

              <Link href="/profile" className="flex flex-col items-center justify-center text-zinc-700 hover:text-black transition-colors group">
                <User className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
              </Link>
              
              <Link href="/profile?tab=wishlist" className="flex flex-col items-center justify-center text-zinc-700 hover:text-black transition-colors group">
                <Heart className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Wishlist</span>
              </Link>

              <Link href="/checkout" className="flex flex-col items-center justify-center text-zinc-700 hover:text-black transition-colors group relative">
                <ShoppingBag className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Bag</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              <button
                onClick={logout}
                className="flex flex-col items-center justify-center text-zinc-700 hover:text-black transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-5">
              <Link href="/login" className="text-[13px] font-bold text-zinc-800 hover:text-black transition-colors">
                Log In
              </Link>
              <Link href="/register" className="text-[13px] font-bold bg-black text-white hover:bg-zinc-800 px-6 py-2.5 rounded transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
    <SupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} openAiChat={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))} />
    </>
  );
};
