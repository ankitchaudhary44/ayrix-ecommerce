'use client';

import React, { useState, useEffect } from 'react';
import { X, Scale, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { api } from '@/lib/api';

interface SizeCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  availableSizes: string[];
}

export const SizeCompareModal: React.FC<SizeCompareModalProps> = ({
  isOpen,
  onClose,
  productId,
  availableSizes
}) => {
  const [sizeA, setSizeA] = useState<string>(availableSizes[0] || 'M');
  const [sizeB, setSizeB] = useState<string>(availableSizes[1] || 'L');
  const [compareData, setCompareData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (availableSizes.length >= 2) {
      setSizeA(availableSizes[0]);
      setSizeB(availableSizes[1]);
    }
  }, [availableSizes]);

  useEffect(() => {
    if (isOpen && productId && sizeA && sizeB) {
      runComparison();
    }
  }, [isOpen, sizeA, sizeB, productId]);

  const runComparison = async () => {
    setLoading(true);
    try {
      const res = await api.post<any>('/fit/compare', {
        productId,
        sizeA,
        sizeB
      });
      setCompareData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f1a] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-6 relative shadow-2xl overflow-hidden glow-cyan">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 border-b border-cyan-500/20 pb-4">
          <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-wider">
            Holographic Size Comparison Matrix
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1.5">Size Option A</label>
            <select
              value={sizeA}
              onChange={(e) => setSizeA(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-500/30 text-white rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-cyan-400"
            >
              {availableSizes.map((sz) => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1.5">Size Option B</label>
            <select
              value={sizeB}
              onChange={(e) => setSizeB(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-500/30 text-white rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-cyan-400"
            >
              {availableSizes.map((sz) => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-cyan-400 font-mono text-xs animate-pulse">Running Holographic Matrix Delta Comparison...</div>
        ) : compareData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${compareData.betterSize === sizeA ? 'bg-cyan-950/40 border-cyan-400/60 glow-cyan' : 'bg-slate-950/60 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-extrabold text-white font-mono">Size {compareData.sizeA.size}</span>
                  {compareData.betterSize === sizeA && (
                    <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">Recommended Winner</span>
                  )}
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Fit Compatibility:</span>
                    <span className="font-bold text-cyan-400">{compareData.sizeA.fitScore}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Return Risk Tier:</span>
                    <span className="font-bold text-slate-200">{compareData.sizeA.riskLevel} ({compareData.sizeA.riskScore}%)</span>
                  </div>
                  {compareData.sizeA.specs.chestCm && (
                    <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                      <span>Chest Width:</span>
                      <span className="text-slate-200">{compareData.sizeA.specs.chestCm} cm</span>
                    </div>
                  )}
                  {compareData.sizeA.specs.shoulderCm && (
                    <div className="flex justify-between text-slate-400">
                      <span>Shoulder Width:</span>
                      <span className="text-slate-200">{compareData.sizeA.specs.shoulderCm} cm</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${compareData.betterSize === sizeB ? 'bg-cyan-950/40 border-cyan-400/60 glow-cyan' : 'bg-slate-950/60 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-extrabold text-white font-mono">Size {compareData.sizeB.size}</span>
                  {compareData.betterSize === sizeB && (
                    <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">Recommended Winner</span>
                  )}
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Fit Compatibility:</span>
                    <span className="font-bold text-cyan-400">{compareData.sizeB.fitScore}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Return Risk Tier:</span>
                    <span className="font-bold text-slate-200">{compareData.sizeB.riskLevel} ({compareData.sizeB.riskScore}%)</span>
                  </div>
                  {compareData.sizeB.specs.chestCm && (
                    <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                      <span>Chest Width:</span>
                      <span className="text-slate-200">{compareData.sizeB.specs.chestCm} cm</span>
                    </div>
                  )}
                  {compareData.sizeB.specs.shoulderCm && (
                    <div className="flex justify-between text-slate-400">
                      <span>Shoulder Width:</span>
                      <span className="text-slate-200">{compareData.sizeB.specs.shoulderCm} cm</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-cyan-500/20 p-4 rounded-xl text-xs text-slate-300">
              <span className="font-mono font-bold text-white block mb-1 uppercase">Comparison Verdict:</span>
              {compareData.explanation}
            </div>
          </div>
        ) : null}

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs px-5 py-2.5 rounded-xl border border-slate-800 transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
