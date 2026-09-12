'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { FitWidget, IFitRecommendationData } from '@/components/FitWidget';
import { SizeCompareModal } from '@/components/SizeCompareModal';
import { ShoppingCart, ArrowLeft, Ruler, Cpu, Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isScanning, setIsScanning] = useState(false);

  const [recommendation, setRecommendation] = useState<IFitRecommendationData | null>(null);
  const [loadingRec, setLoadingRec] = useState(false);

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    if (product) {
      triggerScanAndRec();
    }
  }, [product, user, selectedSize]);

  const triggerScanAndRec = async () => {
    setIsScanning(true);
    setLoadingRec(true);
    try {
      const res = await api.post<IFitRecommendationData>('/fit/recommend', {
        productId: product._id,
        selectedSize
      });
      setRecommendation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsScanning(false);
        setLoadingRec(false);
      }, 600);
    }
  };

  const fetchProduct = async (id: string) => {
    setLoadingProduct(true);
    try {
      const res = await api.get<any>(`/products/${id}`);
      setProduct(res.product);
      if (res.product.sizes?.length > 0) {
        setSelectedSize(res.product.sizes[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setPurchasing(true);
    try {
      await api.post('/purchases', {
        productId: product._id,
        sizePurchased: selectedSize,
        recommendedSize: recommendation?.recommendedSize || selectedSize,
        confidenceScore: recommendation?.confidenceScore || 85,
        returnRiskLevel: 'LOW'
      });
      router.push('/purchases');
    } catch (err) {
      console.error('Purchase failed:', err);
    } finally {
      setPurchasing(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-cyan-400 font-mono text-xs animate-pulse">
        Initializing AYRIX fit scanner & loading garment specifications...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4 font-mono">
        <h2 className="text-xl font-bold text-white">Garment Specification Not Found</h2>
        <Link href="/shop" className="text-xs text-cyan-400 hover:underline">
          &larr; Return to catalog
        </Link>
      </div>
    );
  }

  const chartObj = product.sizeChart || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:underline transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-[#0b0f1a] rounded-3xl overflow-hidden border border-cyan-500/30 relative glow-cyan group">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-laser"></div>
            )}

            <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur border border-cyan-500/30 px-3 py-1 rounded-full text-cyan-400 font-mono text-[10px] font-bold flex items-center gap-1.5 shadow-lg">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              AYRIX FIT SCAN ACTIVE
            </div>
          </div>

          <div className="bg-[#0b0f1a] border border-cyan-500/20 rounded-2xl p-4 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span>Fabric Composition:</span>
              <span className="text-white font-medium">{product.fabric}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Stretch Physics:</span>
              <span className="text-cyan-400 font-bold uppercase">{product.stretchLevel} STRETCH</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Silhouette Fit Cut:</span>
              <span className="text-white capitalize">{product.fitType} fit</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">{product.brand}</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{product.name}</h1>
            <div className="text-2xl font-bold font-mono text-white pt-1">${product.price}</div>
            <p className="text-xs text-slate-400 leading-relaxed pt-2">{product.description}</p>
          </div>

          <div className="space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Size</label>
              <button
                onClick={() => setShowSizeChart(!showSizeChart)}
                className="text-xs text-cyan-400 hover:underline font-bold flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                {showSizeChart ? 'Hide Size Matrix' : 'View Size Matrix'}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {product.sizes.map((sz: string) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-3.5 rounded-xl border font-bold text-sm transition-all transform hover:-translate-y-0.5 ${
                    selectedSize === sz
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg glow-cyan scale-105'
                      : 'bg-[#0b0f1a] border-slate-800 text-slate-300 hover:border-cyan-500/40'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {showSizeChart && (
            <div className="bg-[#0b0f1a] border border-cyan-500/30 rounded-2xl p-4 space-y-3 text-xs font-mono animate-fade-in">
              <h4 className="font-bold text-white uppercase">Garment Dimension Matrix (cm)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-slate-300">
                  <thead className="border-b border-cyan-500/20 text-slate-400">
                    <tr>
                      <th className="py-2 px-2">Size</th>
                      <th className="py-2 px-2">Chest</th>
                      <th className="py-2 px-2">Shoulder</th>
                      <th className="py-2 px-2">Length</th>
                      <th className="py-2 px-2">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {Object.entries(chartObj).map(([sz, specs]: [string, any]) => (
                      <tr key={sz} className={sz === selectedSize ? 'bg-cyan-950/40 text-cyan-300 font-bold' : ''}>
                        <td className="py-2 px-2">{sz}</td>
                        <td className="py-2 px-2">{specs.chestCm || '-'}</td>
                        <td className="py-2 px-2">{specs.shoulderCm || '-'}</td>
                        <td className="py-2 px-2">{specs.lengthCm || '-'}</td>
                        <td className="py-2 px-2">{specs.sleeveCm || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <FitWidget productId={product._id} />

          <div className="pt-2">
            <button
              onClick={handleBuyNow}
              disabled={purchasing}
              className="w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-mono font-extrabold text-xs py-4 rounded-2xl transition-all shadow-xl glow-cyan flex items-center justify-center gap-2 uppercase tracking-widest transform hover:scale-[1.01]"
            >
              <ShoppingCart className="w-5 h-5" />
              {purchasing ? 'Processing Order...' : `Buy Now in Size ${selectedSize}`}
            </button>
          </div>
        </div>
      </div>


      <SizeCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        productId={product._id}
        availableSizes={product.sizes}
      />
    </div>
  );
}
