'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

interface AlternativesCarouselProps {
  alternatives: any[];
}

export const AlternativesCarousel: React.FC<AlternativesCarouselProps> = ({ alternatives }) => {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="bg-[#0b0f1a] border border-cyan-500/30 rounded-2xl p-6 space-y-4 glow-cyan">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Better Fit Holographic Alternatives
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400">Higher confidence & lower predicted return risk</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alternatives.map((alt, idx) => (
          <Link
            key={idx}
            href={`/products/${alt.product._id}`}
            className="bg-slate-950/80 border border-slate-800 hover:border-cyan-400/60 rounded-xl p-4 transition-all group hover:shadow-xl hover:glow-cyan"
          >
            <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden mb-3 relative">
              <img
                src={alt.product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'}
                alt={alt.product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 right-2 bg-emerald-500 text-slate-950 font-mono font-extrabold text-[10px] px-2 py-0.5 rounded shadow glow-emerald">
                {alt.confidenceScore}% Fit Score
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">{alt.product.brand}</div>
              <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                {alt.product.name}
              </h4>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-extrabold font-mono text-slate-200">${alt.product.price}</span>
                <span className="text-[10px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                  Rec Size: <strong className="text-white">{alt.recommendedSize}</strong>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 pt-1 border-t border-slate-900 mt-2 font-mono">
                {alt.reasonText}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
