'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Ruler, ShieldCheck, AlertCircle, Maximize2, Loader2, Sparkles, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FitWidgetProps {
  productId: string;
}

export interface IFitRecommendationData {
  recommendedSize: string;
  confidenceScore: number;
  reasoning: string;
}

export const FitWidget: React.FC<FitWidgetProps> = ({ productId }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fitResult, setFitResult] = useState<any>(null);

  const calculateFit = async () => {
    if (!user) return;
    setLoading(true);
    
    // Simulate AI network delay for UI effect
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Fetch real data
    try {
      const token = localStorage.getItem('ayrix_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/fit`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFitResult(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-black p-6 border border-white/10 text-center font-sans">
        <h4 className="font-bold text-sm text-white uppercase tracking-widest mb-1">Authorization Required</h4>
        <p className="text-[10px] text-white/50 mb-4 uppercase tracking-widest">Sign in to sync your biometrics.</p>
        <a href="/login" className="inline-block bg-white hover:bg-white/90 text-black text-[10px] font-bold py-2 px-6 uppercase tracking-widest transition-colors border border-white">
          Authenticate
        </a>
      </div>
    );
  }

  return (
    <div className="bg-black border border-white/10 overflow-hidden relative font-sans">

      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">
            Fit Insights Panel
          </h3>
          <span className="text-[9px] font-bold text-white/70 border border-white/20 px-2 py-0.5 uppercase tracking-widest">
            {user.profile?.chestCm ? 'SYNCED' : 'NO DATA'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!fitResult && !loading && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
            >
              <p className="text-[10px] text-white/50 mb-6 uppercase tracking-widest font-medium">Cross-referencing your geometry against garment physics.</p>
              
              <button 
                onClick={calculateFit}
                disabled={!user.profile?.chestCm}
                className="w-full bg-white hover:bg-white/90 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-bold text-[11px] py-3 transition-colors disabled:cursor-not-allowed uppercase tracking-widest"
              >
                Execute Analysis
              </button>
            </motion.div>
          )}

          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <Loader2 className="w-6 h-6 text-white animate-spin mx-auto mb-4" />
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
                Analyzing Topology...
              </p>
            </motion.div>
          )}

          {fitResult && !loading && (
            <motion.div 
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between bg-zinc-900/50 p-4 border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[9px] text-white/50 uppercase tracking-widest font-bold mb-1">Predicted Size</span>
                  <span className="text-4xl font-bold text-white">{fitResult.recommendedSize}</span>
                </div>
                
                <div className="text-right flex flex-col items-end">
                  <span className="text-[9px] text-white/50 uppercase tracking-widest font-bold mb-1">Confidence</span>
                  <div className="flex items-center gap-1">
                    <span className="text-3xl font-bold text-white">{fitResult.confidenceScore}</span>
                    <span className="text-sm font-bold text-white/50">%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-white/70 uppercase tracking-widest">
                  <span>Match Probability</span>
                  <span className="text-white">{fitResult.confidenceScore}%</span>
                </div>
                <div className="h-1 w-full bg-zinc-900 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${fitResult.confidenceScore}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="h-full bg-white"
                  />
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-white/5 p-4 flex gap-3">
                <div>
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Engine Analysis</h4>
                  <p className="text-[11px] text-white/70 font-medium leading-relaxed">
                    {fitResult.reasoning}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex gap-2">
                <button 
                  onClick={() => setFitResult(null)}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-bold py-2.5 uppercase tracking-widest transition-colors border border-white/5"
                >
                  Recalculate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
