'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShieldCheck, Heart, ShoppingBag, Truck, Check, Sparkles, ChevronRight, Ruler, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [fitRecommendation, setFitRecommendation] = useState<any>(null);
  const [loadingFit, setLoadingFit] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = product ? isInWishlist(product._id) : false;
  const [pinCode, setPinCode] = useState('');
  const [pinMsg, setPinMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const { addToCart } = useCart();

  const handleAddToBag = () => {
    if (!selectedSize) {
      setToastMsg('Please select a size first');
    } else {
      addToCart(product, selectedSize);
      setToastMsg('Added to bag successfully');
    }
    setTimeout(() => setToastMsg(''), 3000);
  };

  const [checkingPin, setCheckingPin] = useState(false);
  const [pinStatus, setPinStatus] = useState<'success'|'error'|null>(null);

  const handleCheckPin = async () => {
    if (pinCode.length === 6) {
      setCheckingPin(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
        const data = await res.json();
        if (data && data[0].Status === 'Success') {
          setPinStatus('success');
          setPinMsg(`Delivery to ${data[0].PostOffice[0].Name}, ${data[0].PostOffice[0].State} in 2-3 days. Pay on Delivery available.`);
        } else {
          setPinStatus('error');
          setPinMsg('Invalid Pincode entered.');
        }
      } catch (e) {
        setPinStatus('error');
        setPinMsg('Could not verify pincode. Try again.');
      } finally {
        setCheckingPin(false);
      }
    } else {
      setPinStatus('error');
      setPinMsg('Please enter a valid 6-digit pincode.');
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params.id]);

  useEffect(() => {
    if (product && user) {
      predictFit();
    }
  }, [product, user]);

  const fetchProductDetails = async () => {
    try {
      const res = await api.get<any>(`/products/${params.id}`);
      setProduct(res.product);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const predictFit = async () => {
    setLoadingFit(true);
    try {
      const res = await api.post<any>('/fit/recommend', {
        productId: product._id
      });
      setFitRecommendation(res);
      if (res.recommendedSize) {
        setSelectedSize(res.recommendedSize);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFit(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white text-center px-4">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Product Not Found</h1>
        <p className="text-zinc-500 mb-6">The item you are looking for does not exist or has been removed.</p>
        <Link href="/shop" className="bg-rose-500 text-white font-bold py-3 px-8 rounded hover:bg-rose-600 transition-colors">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const fallbackImage = 'https://via.placeholder.com/800x1200?text=No+Image';

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      
      {/* Breadcrumbs */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wide">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-black">Catalog</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-black">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black font-bold truncate max-w-[200px]">{product.brand}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Images Section (Left) */}
          <div className="lg:col-span-7 flex gap-4 h-[600px] sm:h-[800px]">
            {/* Thumbnails (Hidden on mobile) */}
            <div className="hidden sm:flex flex-col gap-4 w-20 shrink-0 h-full overflow-y-auto no-scrollbar">
              {[product.images?.[0] || fallbackImage, product.images?.[0] || fallbackImage, product.images?.[0] || fallbackImage].map((img, i) => (
                <div key={i} className={`w-full aspect-[3/4] cursor-pointer border-2 transition-all ${i === 0 ? 'border-rose-500' : 'border-transparent hover:border-zinc-300'}`}>
                  <img src={img} className="w-full h-full object-cover object-top" alt="Thumbnail" />
                </div>
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-grow h-full bg-zinc-100 overflow-hidden relative cursor-crosshair">
              <img 
                src={product.images?.[0] || fallbackImage} 
                alt={product.name} 
                className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700 origin-top"
              />
            </div>
          </div>

          {/* Product Info Section (Right) */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 uppercase tracking-wider mb-1">
              {product.brand}
            </h1>
            <p className="text-lg text-zinc-500 font-medium mb-4">{product.name}</p>

            <div className="flex items-end gap-3 mb-4 pb-6 border-b border-zinc-200">
              <span className="text-2xl font-bold text-zinc-900">
                Rs. {Math.round(product.price * 82)}
              </span>
              <span className="text-lg text-zinc-400 line-through mb-0.5">
                Rs. {Math.round((product.price * 82) * 1.4)}
              </span>
              <span className="text-sm font-bold text-orange-500 mb-1 tracking-wider uppercase">
                (40% OFF)
              </span>
            </div>

            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-6 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Inclusive of all taxes
            </p>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Select Size</span>
                <button className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-wider flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5" /> Size Chart
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                {product.sizes?.map((size: string) => {
                  const isRecommended = fitRecommendation?.recommendedSize === size;
                  const isSelected = selectedSize === size;
                  
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative w-14 h-14 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all
                        ${isSelected ? 'border-rose-500 text-rose-500' : 'border-zinc-300 text-zinc-800 hover:border-rose-500'}`}
                    >
                      {size}
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 bg-rose-500 rounded-full p-0.5 border-2 border-white">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* AYRIX Engine Widget */}
              {user ? (
                loadingFit ? (
                  <div className="bg-zinc-50 border border-zinc-200 rounded p-4 flex items-center gap-3 animate-pulse">
                    <Sparkles className="w-5 h-5 text-zinc-400" />
                    <span className="text-xs font-bold text-zinc-500 uppercase">AYRIX Engine analyzing geometry...</span>
                  </div>
                ) : fitRecommendation && (
                  <div className={`p-4 rounded border flex flex-col gap-2 transition-colors ${
                    fitRecommendation.riskLevel === 'LOW' ? 'bg-emerald-50 border-emerald-200' :
                    fitRecommendation.riskLevel === 'HIGH' ? 'bg-rose-50 border-rose-200' :
                    'bg-indigo-50 border-indigo-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className={`w-4 h-4 ${
                          fitRecommendation.riskLevel === 'LOW' ? 'text-emerald-600' :
                          fitRecommendation.riskLevel === 'HIGH' ? 'text-rose-600' : 'text-indigo-600'
                        }`} />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                          AYRIX Fit Recommendation
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm text-white ${
                        fitRecommendation.riskLevel === 'LOW' ? 'bg-emerald-500' :
                        fitRecommendation.riskLevel === 'HIGH' ? 'bg-rose-500' : 'bg-indigo-500'
                      }`}>
                        {fitRecommendation.confidenceScore}% MATCH
                      </span>
                    </div>
                    {fitRecommendation.aiExplanation ? (
                      <div className="space-y-3">
                        <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                          {fitRecommendation.aiExplanation}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                        Based on your body geometry, brand fit offsets, and purchase history, we recommend size 
                        <strong className="mx-1 text-sm">{fitRecommendation.recommendedSize}</strong>.
                      </p>
                    )}
                    {fitRecommendation.riskLevel === 'HIGH' && (
                      <p className="text-[11px] text-rose-600 font-bold mt-1 uppercase">
                        Warning: High return risk detected for your geometry in this garment.
                      </p>
                    )}
                  </div>
                )
              ) : (
                <div className="bg-indigo-50 border border-indigo-100 rounded p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                      Unlock AYRIX Perfect Fit
                    </span>
                  </div>
                  <p className="text-xs text-indigo-700">Log in and save your body measurements to instantly know your exact size and fit confidence score.</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-10 relative">
              {toastMsg && (
                <div className="absolute -top-12 left-0 right-0 bg-zinc-900 text-white text-xs font-bold px-4 py-2 rounded flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {toastMsg}
                </div>
              )}
              <button 
                onClick={handleAddToBag}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide transition-colors"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Bag
              </button>
              <button 
                onClick={() => toggleWishlist(product)}
                className={`w-16 h-14 border rounded flex items-center justify-center transition-colors shadow-sm ${
                  isWishlisted ? 'border-rose-500 text-rose-500 bg-rose-50' : 'border-zinc-300 text-zinc-600 hover:text-rose-500 hover:border-rose-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Delivery */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">
                <Truck className="w-5 h-5" /> Delivery Options
              </div>
              <div className="relative">
                <input 
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode" 
                  className="w-full border border-zinc-300 rounded p-3 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 pr-24"
                />
                <button 
                  onClick={handleCheckPin}
                  disabled={checkingPin}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-wider disabled:opacity-50"
                >
                  {checkingPin ? 'Checking...' : 'Check'}
                </button>
              </div>
              {pinMsg ? (
                <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${pinStatus === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {pinStatus === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {pinMsg}
                </p>
              ) : (
                <p className="text-[11px] text-zinc-500 mt-2">Please enter PIN code to check delivery time & Pay on Delivery Availability</p>
              )}
            </div>

            {/* Product Details Specs */}
            <div className="border-t border-zinc-200 pt-8">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                Product Details
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed mb-6">{product.description}</p>
              
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Fabric</span>
                  <span className="text-sm font-medium text-zinc-900">{product.fabric || 'Premium Cotton Blend'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Fit Type</span>
                  <span className="text-sm font-medium text-zinc-900 capitalize">{product.fitType} Fit</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Stretch Physics</span>
                  <span className="text-sm font-medium text-zinc-900 capitalize">{product.stretchLevel} Level</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Brand Offset</span>
                  <span className="text-sm font-medium text-zinc-900">{(product.brandFitOffset || 0) > 0 ? `+${product.brandFitOffset}` : (product.brandFitOffset || 0)}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
