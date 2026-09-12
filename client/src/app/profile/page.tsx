'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { User, Ruler, Settings, Box, Heart, CreditCard, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/ProductCard';

import { useSearchParams } from 'next/navigation';

function ProfileContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState(user?.profile || {});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'measurements');
  const [activeTabState, setActiveTabState] = useState<{resetStep?: string, otp?: string, newPassword?: string}>({});
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    if (user?.profile) setProfile(user.profile);
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      await api.put('/users/profile', profile);
      setSuccessMsg('Fit geometry synced with AYRIX Engine.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-zinc-50">
        <div className="bg-white p-8 border border-zinc-200 rounded shadow-sm max-w-sm text-center">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">PLEASE LOG IN</h2>
          <p className="text-zinc-500 text-sm mb-6">Login to view your saved addresses, track orders, and manage your fit profile.</p>
          <Link href="/login" className="block w-full bg-rose-500 text-white font-bold py-3 rounded hover:bg-rose-600 transition-colors uppercase">
            Login / Sign Up
          </Link>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'measurements':
        return (
          <div className="bg-white border border-zinc-200 shadow-sm rounded">
            <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  My Fit Geometry
                </h2>
                <p className="text-sm text-zinc-500 mt-1">Update your measurements to allow our AYRIX AI Engine to predict your perfect size.</p>
              </div>
              <Sparkles className="w-5 h-5 text-rose-500" />
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Height (CM)</label>
                <input 
                  type="number"
                  value={profile.heightCm || ''}
                  onChange={(e) => setProfile({...profile, heightCm: Number(e.target.value)})}
                  className="w-full border border-zinc-300 rounded p-3 text-sm text-zinc-900 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  placeholder="e.g. 175"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Weight (KG)</label>
                <input 
                  type="number"
                  value={profile.weightKg || ''}
                  onChange={(e) => setProfile({...profile, weightKg: Number(e.target.value)})}
                  className="w-full border border-zinc-300 rounded p-3 text-sm text-zinc-900 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  placeholder="e.g. 70"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Chest (CM)</label>
                <input 
                  type="number"
                  value={profile.chestCm || ''}
                  onChange={(e) => setProfile({...profile, chestCm: Number(e.target.value)})}
                  className="w-full border border-zinc-300 rounded p-3 text-sm text-zinc-900 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  placeholder="e.g. 98"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Waist (CM)</label>
                <input 
                  type="number"
                  value={profile.waistCm || ''}
                  onChange={(e) => setProfile({...profile, waistCm: Number(e.target.value)})}
                  className="w-full border border-zinc-300 rounded p-3 text-sm text-zinc-900 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  placeholder="e.g. 82"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Preferred Fit Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {['tight', 'regular', 'relaxed', 'oversized'].map((fit) => (
                    <button
                      key={fit}
                      onClick={() => setProfile({...profile, preferredFit: fit as any})}
                      className={`p-3 text-sm font-bold uppercase tracking-wider border rounded transition-all
                        ${profile.preferredFit === fit ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-200 flex items-center justify-between bg-zinc-50/50">
              <div>
                {successMsg && (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle2 className="w-4 h-4" /> {successMsg}
                  </div>
                )}
              </div>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded shadow-sm uppercase tracking-wider text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <><Sparkles className="w-4 h-4 animate-spin" /> Syncing Engine...</>
                ) : (
                  'Save Measurements'
                )}
              </button>
            </div>
          </div>
        );

      case 'wishlist':
        if (wishlistItems.length === 0) {
          return (
            <div className="bg-white border border-zinc-200 shadow-sm rounded p-12 text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-rose-300" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2 uppercase tracking-wide">Your Wishlist is Empty</h3>
              <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">Save items that you like in your wishlist. Review them anytime and easily move them to the bag.</p>
              <Link href="/shop" className="inline-block border border-rose-500 text-rose-500 hover:bg-rose-50 font-bold px-8 py-3 rounded uppercase tracking-wider text-sm transition-colors">
                Continue Shopping
              </Link>
            </div>
          );
        }
        
        return (
          <div className="bg-white border border-zinc-200 shadow-sm rounded p-6">
            <h2 className="text-lg font-bold text-zinc-900 mb-6 uppercase tracking-wide border-b border-zinc-200 pb-4">
              My Wishlist ({wishlistItems.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {wishlistItems.map((item) => (
                <ProductCard key={item.id} product={item.product} />
              ))}
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className="bg-white border border-zinc-200 shadow-sm rounded p-8">
            <div className="flex items-center justify-between mb-6 border-b border-zinc-200 pb-4">
              <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide">Saved Addresses</h2>
              <button className="text-xs font-bold text-rose-500 uppercase tracking-wider hover:underline">
                + Add New Address
              </button>
            </div>
            <div className="border border-zinc-200 rounded p-4 relative hover:border-zinc-300 transition-colors cursor-pointer">
              <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase px-2 py-1 rounded absolute top-4 right-4">Default</span>
              <h4 className="font-bold text-zinc-900 text-sm mb-1">{user.name}</h4>
              <p className="text-sm text-zinc-600 leading-relaxed max-w-md">
                101, Cyber City Phase 2, DLF Tech Park<br />
                Gurugram, Haryana - 122002<br />
                India
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 flex gap-4">
                <button className="text-xs font-bold text-zinc-500 hover:text-rose-500 uppercase">Edit</button>
                <button className="text-xs font-bold text-zinc-500 hover:text-rose-500 uppercase">Remove</button>
              </div>
            </div>
          </div>
        );

      case 'cards':
        return (
          <div className="bg-white border border-zinc-200 shadow-sm rounded p-8">
            <div className="mb-6 border-b border-zinc-200 pb-4">
              <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide">Saved Cards</h2>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <CreditCard className="w-12 h-12 text-zinc-300 mb-4" />
              <p className="text-sm text-zinc-500 mb-2">Save your credit/debit cards during checkout for faster payments.</p>
              <p className="text-xs font-medium text-zinc-400">AYRIX uses 256-bit encryption. Your card details are completely secure.</p>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="bg-white border border-zinc-200 shadow-sm rounded p-8">
            <div className="mb-6 border-b border-zinc-200 pb-4">
              <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide">Profile Details</h2>
            </div>
            <div className="max-w-md space-y-6">
              <div className="space-y-1 border-b border-zinc-100 pb-4">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Full Name</label>
                <div className="text-sm font-medium text-zinc-900">{user.name}</div>
              </div>
              <div className="space-y-1 border-b border-zinc-100 pb-4">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                <div className="text-sm font-medium text-zinc-900">{user.email}</div>
              </div>
              
              {!activeTabState.resetStep && (
                <button 
                  onClick={async () => {
                    try {
                      await fetch('http://localhost:5001/api/auth/forgot-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user.email })
                      });
                      setActiveTabState({ ...activeTabState, resetStep: 'otp' });
                      setSuccessMsg('A password reset link with OTP has been sent to your email.');
                    } catch (e) {}
                  }}
                  className="w-full bg-white border border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50 text-zinc-900 font-bold py-3 rounded text-sm uppercase tracking-wider transition-colors"
                >
                  Change Password
                </button>
              )}

              {activeTabState.resetStep === 'otp' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Enter OTP from Email</label>
                    <input 
                      type="text" 
                      maxLength={6}
                      value={activeTabState.otp || ''}
                      onChange={e => setActiveTabState({ ...activeTabState, otp: e.target.value })}
                      className="w-full border border-zinc-300 rounded p-2 text-sm focus:border-black focus:outline-none tracking-widest text-center" 
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">New Password</label>
                    <input 
                      type="password" 
                      value={activeTabState.newPassword || ''}
                      onChange={e => setActiveTabState({ ...activeTabState, newPassword: e.target.value })}
                      className="w-full border border-zinc-300 rounded p-2 text-sm focus:border-black focus:outline-none" 
                    />
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch('http://localhost:5001/api/auth/reset-password', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: user.email, otp: activeTabState.otp, newPassword: activeTabState.newPassword })
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setSuccessMsg('Password changed successfully.');
                          setActiveTabState({});
                        } else {
                          alert(data.error);
                        }
                      } catch (e) {}
                    }}
                    className="w-full bg-black text-white font-bold py-3 rounded text-sm uppercase tracking-wider hover:bg-zinc-800"
                  >
                    Confirm New Password
                  </button>
                </div>
              )}

              {successMsg && (
                <div className="text-emerald-600 text-xs font-bold flex items-center gap-2 animate-in fade-in bg-emerald-50 p-3 rounded">
                  <CheckCircle2 className="w-4 h-4" /> {successMsg}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-8 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-xl font-bold text-zinc-900 mb-6 border-b border-zinc-200 pb-4 uppercase tracking-wide">Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Menu */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white border border-zinc-200 shadow-sm rounded overflow-hidden">
              <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-200 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-zinc-500" />
                </div>
                <div className="truncate">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Hello,</div>
                  <div className="text-sm font-bold text-zinc-900 truncate">{user.name}</div>
                </div>
              </div>
              
              <div className="py-2">
                <button 
                  onClick={() => setActiveTab('measurements')}
                  className={`w-full text-left px-6 py-3.5 text-sm font-bold flex items-center gap-3 transition-colors ${activeTab === 'measurements' ? 'text-rose-500 border-l-4 border-rose-500 bg-rose-50/50' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border-l-4 border-transparent'}`}
                >
                  <Ruler className="w-4 h-4" /> My Measurements
                </button>
                <Link href="/purchases" className="w-full text-left px-6 py-3.5 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 flex items-center gap-3 transition-colors border-l-4 border-transparent">
                  <Box className="w-4 h-4" /> Orders & Returns
                </Link>
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full text-left px-6 py-3.5 text-sm font-bold flex items-center gap-3 transition-colors ${activeTab === 'wishlist' ? 'text-rose-500 border-l-4 border-rose-500 bg-rose-50/50' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border-l-4 border-transparent'}`}
                >
                  <Heart className="w-4 h-4" /> Wishlist
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-6 py-3.5 text-sm font-bold flex items-center gap-3 transition-colors ${activeTab === 'addresses' ? 'text-rose-500 border-l-4 border-rose-500 bg-rose-50/50' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border-l-4 border-transparent'}`}
                >
                  <MapPin className="w-4 h-4" /> Addresses
                </button>
                <button 
                  onClick={() => setActiveTab('cards')}
                  className={`w-full text-left px-6 py-3.5 text-sm font-bold flex items-center gap-3 transition-colors ${activeTab === 'cards' ? 'text-rose-500 border-l-4 border-rose-500 bg-rose-50/50' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border-l-4 border-transparent'}`}
                >
                  <CreditCard className="w-4 h-4" /> Saved Cards
                </button>
                <button 
                  onClick={() => setActiveTab('details')}
                  className={`w-full text-left px-6 py-3.5 text-sm font-bold flex items-center gap-3 transition-colors ${activeTab === 'details' ? 'text-rose-500 border-l-4 border-rose-500 bg-rose-50/50' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border-l-4 border-transparent'}`}
                >
                  <Settings className="w-4 h-4" /> Profile Details
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center bg-zinc-50">Loading profile data...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
