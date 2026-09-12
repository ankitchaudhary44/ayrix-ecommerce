'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen pt-24 pb-20 max-w-4xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-10 rounded-2xl border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.1)] relative overflow-hidden"
      >
        <div className="absolute inset-0 laser-grid opacity-10 pointer-events-none"></div>
        <div className="relative z-10 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 tracking-widest uppercase">
              Terms of Service
            </h1>
            <p className="text-cyan-500/70 uppercase tracking-widest text-xs">Last Updated: 2026.12.01</p>
          </div>
          
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed font-medium">
            <section>
              <h2 className="text-lg font-black text-purple-400 uppercase tracking-widest mb-2 glow-purple-subtle">1. Agreement to Terms</h2>
              <p>By accessing the AYRIX platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-purple-400 uppercase tracking-widest mb-2 glow-purple-subtle">2. Fit Recommendation Accuracy</h2>
              <p>While AYRIX utilizes advanced geometric calculations, recommendations are provided as-is. We guarantee free returns if the Fit Engine generates a "LOW RISK" recommendation that results in an unsatisfactory fit.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-purple-400 uppercase tracking-widest mb-2 glow-purple-subtle">3. User Obligations</h2>
              <p>You agree to provide accurate physical measurements. Intentional falsification of biometrics that triggers the Return Guarantee may result in account termination.</p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
