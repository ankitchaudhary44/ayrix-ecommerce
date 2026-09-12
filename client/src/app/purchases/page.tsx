'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { FeedbackModal } from '@/components/FeedbackModal';
import { Package, MessageSquare, AlertCircle, TrendingUp, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PurchasesPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await api.get<any>('/purchases/my');
      setPurchases(res.purchases || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openFeedback = (purchase: any) => {
    setSelectedPurchase(purchase);
    setIsFeedbackOpen(true);
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-zinc-50">
        <div className="bg-white p-8 border border-zinc-200 rounded shadow-sm max-w-sm text-center">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">PLEASE LOG IN</h2>
          <p className="text-zinc-500 text-sm mb-6">Sign in to view your order logs and submit fit feedback.</p>
          <Link href="/login" className="block w-full bg-rose-500 text-white font-bold py-3 rounded hover:bg-rose-600 transition-colors uppercase tracking-wider text-sm">
            Login / Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 font-sans">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="mb-6 border-b border-zinc-200 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 uppercase tracking-wide">Order Logs & Returns</h1>
            <p className="text-sm text-zinc-500 mt-1">Submit post-purchase fit outcomes to refine future AYRIX recommendations.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors bg-white border border-zinc-200 px-4 py-2 rounded shadow-sm">
            <Filter className="w-4 h-4" /> Filter Orders
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-zinc-200 rounded h-32 w-full"></div>
            ))}
          </div>
        ) : purchases.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-zinc-200 rounded p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">No Order Logs Found</h3>
            <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">You haven't made any purchases yet. Your order history and fit feedback loop will appear here.</p>
            <Link href="/shop" className="inline-block bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold uppercase tracking-wider px-8 py-3 rounded shadow-sm transition-colors">
              Browse Garment Catalog
            </Link>
          </div>
        ) : (
          /* Purchases List */
          <div className="space-y-4">
            {purchases.map((pur) => (
              <div
                key={pur._id}
                className="bg-white border border-zinc-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
              >
                
                {/* Header ribbon for status */}
                <div className={`h-1 w-full ${
                  pur.status === 'retained' ? 'bg-emerald-500' :
                  pur.status === 'returned' ? 'bg-rose-500' : 'bg-amber-500'
                }`}></div>

                <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-6">
                  
                  {/* Product Image */}
                  <div className="shrink-0 w-24 h-32 sm:w-32 sm:h-40 bg-zinc-100 rounded overflow-hidden border border-zinc-200 relative group">
                    <img
                      src={pur.productId?.images?.[0] || 'https://via.placeholder.com/200x300?text=No+Image'}
                      alt={pur.productId?.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* AYRIX Risk Overlay */}
                    {pur.returnRiskLevel === 'HIGH' && (
                      <div className="absolute top-0 left-0 right-0 bg-rose-500/90 text-white text-[9px] font-bold uppercase text-center py-0.5 tracking-wider backdrop-blur-sm">
                        High Risk Fit
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link href={`/shop/${pur.productId?._id}`} className="text-sm font-bold text-zinc-900 uppercase hover:text-rose-500 transition-colors">
                            {pur.productId?.brand}
                          </Link>
                          <p className="text-[13px] text-zinc-500 mt-0.5 line-clamp-1">{pur.productId?.name}</p>
                          <p className={`text-xs font-bold mt-2 uppercase tracking-wide flex items-center gap-1 ${
                             pur.shippingStatus === 'delivered' ? 'text-emerald-600' :
                             pur.shippingStatus === 'shipped' ? 'text-blue-600' : 'text-amber-500'
                          }`}>
                            <Package className="w-3.5 h-3.5" /> 
                            {(pur.shippingStatus === 'processing' ? 'ordered' : pur.shippingStatus) || 'ordered'}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-zinc-900">Rs. {Math.round(pur.priceAtPurchase * 82)}</span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-[13px]">
                        <div>
                          <span className="text-zinc-500 block text-[11px] uppercase tracking-wider font-bold mb-1">Purchased Size</span>
                          <span className="font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">{pur.sizePurchased}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[11px] uppercase tracking-wider font-bold mb-1">Engine Confidence</span>
                          <span className="font-semibold text-zinc-900">{pur.confidenceScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions and Status */}
                    <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-2">
                        {pur.status === 'retained' ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide border border-emerald-100">
                            <CheckCircle2 className="w-4 h-4" /> Retained
                          </div>
                        ) : pur.status === 'returned' ? (
                          <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide border border-rose-100">
                            <AlertCircle className="w-4 h-4" /> Returned
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide border border-amber-100">
                            <TrendingUp className="w-4 h-4" /> Pending Feedback
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => openFeedback(pur)}
                        className={`text-xs font-bold px-5 py-2.5 rounded shadow-sm transition-all uppercase tracking-wider flex items-center justify-center gap-2
                          ${pur.status === 'pending_feedback' 
                            ? 'bg-zinc-900 text-white hover:bg-zinc-800' 
                            : 'bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50'}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        {pur.status === 'pending_feedback' ? 'Submit Fit Feedback' : 'Update Feedback'}
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        purchase={selectedPurchase}
        onSuccess={fetchPurchases}
      />
    </div>
  );
}
