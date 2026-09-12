'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SizeGuidePage() {
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
              Size Guide & Ease Specs
            </h1>
            <p className="text-cyan-500/70 uppercase tracking-widest text-xs">Understanding AYRIX Geometry</p>
          </div>
          
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed font-medium">
            <section>
              <h2 className="text-lg font-black text-purple-400 uppercase tracking-widest mb-2 glow-purple-subtle">What is Garment Ease?</h2>
              <p>Ease refers to the difference between your exact body measurement and the physical dimensions of a garment. AYRIX calculates <strong>wearing ease</strong> (needed for movement) and <strong>design ease</strong> (the intended silhouette: tight, regular, oversized).</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-purple-400 uppercase tracking-widest mb-2 glow-purple-subtle">How We Measure You</h2>
              <p>We require three primary coordinates to map your torso geometry:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-cyan-100">
                <li><strong>Chest:</strong> Measured across the fullest part of the chest.</li>
                <li><strong>Waist:</strong> Measured at the natural waistline.</li>
                <li><strong>Shoulder:</strong> Measured point-to-point across the back.</li>
              </ul>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
