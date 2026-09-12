'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Plus, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function WalletPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    const addAmount = Number(amount);
    if (!addAmount || addAmount <= 0) return;
    
    setProcessing(true);
    try {
      const res = await fetch('http://localhost:5001/api/payment/mock-recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('ayrix_token')}` },
        body: JSON.stringify({ amount: addAmount })
      });
      
      if (res.ok) {
        setSuccess(true);
        if (user) {
          user.walletBalance = (user.walletBalance || 0) + addAmount;
        }
        setAmount('');
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (!user) return <div className="p-12 text-center text-zinc-500">Please login to view wallet.</div>;

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Wallet Balance Card */}
        <div className="bg-black text-white rounded-2xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Available Balance</h2>
            <div className="text-5xl font-extrabold tracking-tight mb-8">
              ₹ {(user as any).walletBalance?.toLocaleString() || '0'}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> 100% Secure & Instantly Available
            </div>
          </div>
        </div>

        {/* Add Money Form */}
        <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-wide mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Money to Wallet
          </h3>
          
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-3 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5" /> Recharge Successful!
            </div>
          )}

          <form onSubmit={handleAddMoney} className="max-w-md space-y-6">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Amount to add (₹)</label>
              <input 
                type="number" 
                min="1"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full text-2xl font-bold border-b-2 border-zinc-200 py-2 focus:outline-none focus:border-black transition-colors"
              />
            </div>
            
            <div className="flex gap-3">
              {[500, 1000, 2000, 5000].map(val => (
                <button 
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className="px-4 py-2 text-sm font-bold text-zinc-600 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
                >
                  +₹{val}
                </button>
              ))}
            </div>

            <button 
              type="submit"
              disabled={processing || !amount}
              className="w-full bg-black text-white font-bold py-4 rounded-lg uppercase tracking-wider hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {processing ? 'Processing...' : 'Proceed to Pay'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
