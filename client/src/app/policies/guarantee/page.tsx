'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function GuaranteePage() {
  return (
    <div className="min-h-screen pt-24 pb-20 max-w-4xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-10 rounded-2xl border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.1)] relative overflow-hidden"
      >
        <div className="absolute inset-0 laser-grid opacity-10 pointer-events-none"></div>
        <div className="relative z-10 space-y-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#00F0FF] via-indigo-500 to-[#9333ea] flex items-center justify-center shadow-[0_0_30px_#00F0FF]">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 tracking-widest uppercase">
              Perfect Fit Guarantee
            </h1>
            <p className="text-cyan-500/70 uppercase tracking-widest text-xs">Zero-Risk Shopping Protocol</p>
          </div>
          
          <div className="text-slate-300 text-sm leading-relaxed font-medium max-w-2xl mx-auto space-y-4">
            <p>If the AYRIX Fit Engine explicitly recommends a size with a <strong>LOW RETURN RISK</strong> and the garment fails to fit appropriately, we guarantee a completely free return, zero restocking fees, and an instant refund.</p>
            <p>Furthermore, your return feedback will instantly train the neural network to adjust brand-specific sizing offsets, ensuring perfection on your next purchase.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
