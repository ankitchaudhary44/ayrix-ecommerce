'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Tag, Plus, CheckCircle2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState('');
  const [days, setDays] = useState('30');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get<any>('/coupons');
      setCoupons(res.coupons);
    } catch (e) {}
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + parseInt(days));
      
      await api.post('/coupons', {
        code,
        discountType: type,
        discountValue: Number(value),
        validUntil
      });
      setCode('');
      setValue('');
      fetchCoupons();
    } catch (e) {
      alert('Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight uppercase">Discount Engine</h1>
        <p className="text-sm text-zinc-500 font-medium mt-1">Generate and monitor promotional coupons</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Coupon
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1 block">Code</label>
                <input required type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. SUMMER50" className="w-full border border-zinc-300 rounded p-2 text-sm uppercase font-mono focus:border-black focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1 block">Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-zinc-300 rounded p-2 text-sm focus:border-black focus:outline-none">
                    <option value="percentage">% Off</option>
                    <option value="fixed">Flat Rate</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1 block">Value</label>
                  <input required type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="e.g. 20" className="w-full border border-zinc-300 rounded p-2 text-sm focus:border-black focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1 block">Validity (Days)</label>
                <input required type="number" value={days} onChange={e => setDays(e.target.value)} className="w-full border border-zinc-300 rounded p-2 text-sm focus:border-black focus:outline-none" />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-black text-white font-bold py-2 rounded text-sm uppercase tracking-wider hover:bg-zinc-800 disabled:opacity-50">
                Generate
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <th className="p-4">Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Expires</th>
                  <th className="p-4">Created By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {coupons.map(c => (
                  <tr key={c._id} className="hover:bg-zinc-50/50">
                    <td className="p-4 font-mono font-bold">{c.code}</td>
                    <td className="p-4 font-medium">{c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}</td>
                    <td className="p-4">
                      {c.isActive && new Date(c.validUntil) > new Date() ? (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center w-fit gap-1"><CheckCircle2 className="w-3 h-3"/> Active</span>
                      ) : (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Inactive</span>
                      )}
                    </td>
                    <td className="p-4 text-zinc-500 text-xs">{new Date(c.validUntil).toLocaleDateString()}</td>
                    <td className="p-4 text-zinc-500 text-xs">{c.createdBy?.name || 'System'}</td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">No coupons active.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
