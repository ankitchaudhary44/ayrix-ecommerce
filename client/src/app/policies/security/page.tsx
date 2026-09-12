'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SecurityPage() {
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
              Security Standards
            </h1>
            <p className="text-cyan-500/70 uppercase tracking-widest text-xs">Enterprise Grade Protection</p>
          </div>
          
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed font-medium">
            <section>
              <h2 className="text-lg font-black text-purple-400 uppercase tracking-widest mb-2 glow-purple-subtle">256-Bit Encryption</h2>
              <p>All biometric profiles, purchase histories, and payment data are encrypted at rest using AES-256 and in transit using TLS 1.3.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-purple-400 uppercase tracking-widest mb-2 glow-purple-subtle">Zero Trust Architecture</h2>
              <p>Our microservices operate on a strict Zero Trust model. No single service has full access to the complete user database without explicit, multi-factor authorization tokens.</p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
