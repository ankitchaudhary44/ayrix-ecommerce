'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-cyan-500/70 uppercase tracking-widest text-xs">Last Updated: 2026.12.01</p>
          </div>
          
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed font-medium">
            <section>
              <h2 className="text-lg font-black text-purple-400 uppercase tracking-widest mb-2 glow-purple-subtle">1. Data Collection</h2>
              <p>AYRIX collects biometric data strictly for the purpose of precision garment fit calculation. This includes physical measurements (chest, waist, shoulder), past purchase history, and post-purchase fit feedback. We do not sell your geometric data to third parties.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-purple-400 uppercase tracking-widest mb-2 glow-purple-subtle">2. Processing & Security</h2>
              <p>Your biometric and fit profile data is processed using proprietary machine-learning algorithms and stored using state-of-the-art 256-bit encryption. All transmissions between the client and our servers occur over secure, encrypted protocols.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-purple-400 uppercase tracking-widest mb-2 glow-purple-subtle">3. Anonymization</h2>
              <p>For analytics and macro-fit trend analysis, all data is stripped of personally identifiable information (PII) before being used to train the AYRIX Fit Engine.</p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
