'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { 
  TrendingUp, Activity, CheckCircle2, AlertTriangle, MessageSquare, 
  Target, BarChart3, Users, Zap, LineChart, Star, Box, Search, 
  Lightbulb, ChevronRight, Settings, ArrowRight, MousePointerClick, 
  RefreshCcw, RefreshCw, Package
} from 'lucide-react';
import Link from 'next/link';

export default function PMDashboard() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponVal, setNewCouponVal] = useState(10);
  const [bonusEmail, setBonusEmail] = useState("");
  const [bonusAmt, setBonusAmt] = useState(500);
  const handleGiveBonus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/payment/admin/credit-wallet-by-email", { email: bonusEmail, amount: bonusAmt, description: "PM Discretionary Bonus" });
      if (res) { alert("Bonus credited successfully!"); setBonusEmail(""); }
    } catch(err) { alert("Failed to credit bonus. Check email."); }
  };


  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
    fetchCoupons();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/pm/orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('ayrix_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch(e) {}
  };

  const fetchCoupons = async () => {
    try {
      const res = await api.get<any>("/coupons");
      setCoupons(res.coupons || []);
    } catch(e) {}
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/coupons", {
        code: newCouponCode,
        discountType: "percentage",
        discountValue: newCouponVal,
        validUntil: new Date(Date.now() + 30*24*60*60*1000)
      });
      setNewCouponCode("");
      fetchCoupons();
    } catch(err) { alert("Failed to create coupon"); }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/pm/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ayrix_token')}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {}
  };

  const kpis = [
    { title: 'TOTAL ORDERS (30D)', value: '14,285', trend: '+12%', icon: <Box className="w-5 h-5 text-zinc-500" /> },
    { title: 'FIT RECOMS GENERATED', value: '45.2K', trend: '+28%', icon: <Activity className="w-5 h-5 text-zinc-500" /> },
    { title: 'FIRST-FIT SUCCESS RATE', value: '82.4%', trend: '+4.2%', icon: <CheckCircle2 className="w-5 h-5 text-zinc-500" />, trendColor: 'text-emerald-600' },
    { title: 'FIT-RELATED RETURN RATE', value: '8.1%', trend: '-2.4%', icon: <RefreshCcw className="w-5 h-5 text-zinc-500" />, trendColor: 'text-emerald-600' }
  ];

  const highRiskProducts = [
    { name: 'Oversized Tech Hoodie', category: 'Men', orders: 420, fitReturns: '31%', risk: 'High', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { name: 'Slim Fit Oxford Shirt', category: 'Men', orders: 510, fitReturns: '18%', risk: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'Premium Relaxed Jeans', category: 'Women', orders: 840, fitReturns: '14%', risk: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'Essential Cotton Tee', category: 'Unisex', orders: 1250, fitReturns: '6%', risk: 'Low', color: 'bg-zinc-100 text-zinc-700 border-zinc-200' }
  ];

  const brandPerformance = [
    { name: 'AeroAthletics', success: 91, barWidth: '91%' },
    { name: 'UrbanCraft', success: 86, barWidth: '86%' },
    { name: 'DenimWorks', success: 82, barWidth: '82%' },
    { name: 'ApexStudio', success: 79, barWidth: '79%' },
    { name: 'HeritageThread', success: 74, barWidth: '74%' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F5] font-sans">
      {/* Enterprise Header */}
      <header className="bg-slate-900 text-white shrink-0 border-b border-slate-800">
        <div className="px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              AYRIX Product Intelligence
            </h1>
            <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Analytics & Fit Optimizations</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Engine Active</span>
            </div>
            <div className="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-500 shadow-inner">
              {user?.name?.[0]?.toUpperCase() || 'P'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 bg-white border border-zinc-300 shadow-sm">
          {kpis.map((kpi, idx) => (
            <div key={idx} className={`p-6 flex flex-col \${idx !== 3 ? 'border-r border-zinc-200' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{kpi.title}</span>
                {kpi.icon}
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-zinc-900 tracking-tight">{kpi.value}</span>
                <span className={`text-[11px] font-bold mb-1.5 \${kpi.trendColor || (kpi.trend.startsWith('+') ? 'text-indigo-600' : 'text-zinc-500')}`}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Actionable Insights */}
        <div className="bg-white border border-zinc-300 shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-zinc-200 flex items-center gap-2 bg-zinc-50">
            <Lightbulb className="w-4 h-4 text-zinc-500" />
            <h2 className="text-[11px] font-bold text-zinc-800 uppercase tracking-widest">Actionable Product Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
            <div className="p-6 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded uppercase tracking-widest">High Priority</span>
              </div>
              <p className="text-[13px] text-zinc-900 font-medium mb-4">Slim-fit shirts have 24% higher fit-related returns than the category average.</p>
              <div className="flex items-center gap-2 text-[11px] font-bold text-rose-700 uppercase tracking-widest">
                <ArrowRight className="w-3.5 h-3.5" />
                Action: Investigate size-chart
              </div>
            </div>
            
            <div className="p-6 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase tracking-widest">Optimization</span>
              </div>
              <p className="text-[13px] text-zinc-900 font-medium mb-4">31% of users who reject recommendation select exactly one size larger.</p>
              <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700 uppercase tracking-widest">
                <ArrowRight className="w-3.5 h-3.5" />
                Action: Review ease logic
              </div>
            </div>

            <div className="p-6 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded uppercase tracking-widest">Insight</span>
              </div>
              <p className="text-[13px] text-zinc-900 font-medium mb-4">HeritageThread brand has significantly lower first-fit success (-8%).</p>
              <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-700 uppercase tracking-widest">
                <ArrowRight className="w-3.5 h-3.5" />
                Action: Adjust brand offset
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Return Risk Analysis */}
          <div className="bg-white border border-zinc-300 shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
              <h2 className="text-[11px] font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-zinc-500" />
                Return Risk Analysis
              </h2>
              <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">Export</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 border-b border-zinc-300 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    <th className="px-6 py-3">Product Name</th>
                    <th className="px-6 py-3 text-right">Orders</th>
                    <th className="px-6 py-3 text-right">Fit Returns</th>
                    <th className="px-6 py-3 text-center">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {highRiskProducts.map((p, i) => (
                    <tr key={i} className="hover:bg-zinc-50 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 text-[13px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{p.name}</td>
                      <td className="px-6 py-4 text-[12px] text-zinc-700 text-right font-medium">{p.orders}</td>
                      <td className="px-6 py-4 text-[12px] text-zinc-700 text-right font-medium">{p.fitReturns}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[9px] font-bold px-2 py-0.5 border rounded uppercase tracking-widest \${p.color}`}>
                          {p.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Brand Performance Analysis */}
          <div className="bg-white border border-zinc-300 shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
              <h2 className="text-[11px] font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-zinc-500" />
                Recommendation Quality Metrics
              </h2>
            </div>
            <div className="p-6 space-y-5 flex-1">
              <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200">
                <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Avg Engine Confidence</span>
                <span className="text-lg font-bold text-indigo-600">84.2%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">Recommendation Accepted</span>
                <span className="text-lg font-bold text-emerald-600">68.0%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">Selected Different Size</span>
                <span className="text-lg font-bold text-amber-600">21.0%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-rose-50 border border-rose-200">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-widest">Item Returned (Fit Issue)</span>
                <span className="text-lg font-bold text-rose-600">11.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Fulfillment Management */}
        <div className="bg-white border border-zinc-300 shadow-sm flex flex-col mt-8">
          <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
            <h2 className="text-[11px] font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-2">
              <Package className="w-4 h-4 text-zinc-500" />
              Order Fulfillment & Status
            </h2>
            <button onClick={fetchOrders} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100 border-b border-zinc-300 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Size</th>
                  <th className="px-6 py-3">Shipping Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-[13px] font-bold text-zinc-900">{o.userId?.name || 'Unknown'}</div>
                      <div className="text-[11px] text-zinc-500">{o.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] font-bold text-zinc-900 line-clamp-1 max-w-[200px]">{o.productId?.name}</div>
                      <div className="text-[11px] text-zinc-500">{o.productId?.brand}</div>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-zinc-700">
                      {o.sizePurchased}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                        o.shippingStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        o.shippingStatus === 'shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {(o.shippingStatus === 'processing' ? 'ordered' : o.shippingStatus) || 'ordered'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <select 
                        className="text-[11px] font-bold border border-zinc-300 rounded px-2 py-1 bg-white focus:outline-none"
                        value={o.shippingStatus || 'processing'}
                        onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                      >
                        <option value="processing">Ordered</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 text-sm">
                      No orders found in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* COUPON MANAGEMENT */}
        <div className="mt-8 bg-white border border-zinc-300 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
            <h2 className="text-[11px] font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-500" />
              Marketing & Discount Coupons
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 border-r border-zinc-100 pr-6">
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Coupon Code</label>
                  <input type="text" value={newCouponCode} onChange={(e)=>setNewCouponCode(e.target.value)} placeholder="e.g. FLASH30" className="w-full border border-zinc-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-rose-500" required />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Discount %</label>
                  <input type="number" value={newCouponVal} onChange={(e)=>setNewCouponVal(Number(e.target.value))} className="w-full border border-zinc-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-rose-500" required min="1" max="100" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-wider py-2.5 rounded hover:bg-indigo-700 transition-colors">Generate Coupon</button>
              </form>
            </div>
            <div className="col-span-2 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200 text-[10px] uppercase font-bold text-zinc-500">
                    <th className="pb-2">Code</th>
                    <th className="pb-2">Discount</th>
                    <th className="pb-2">Valid Until</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c: any) => (
                    <tr key={c._id} className="border-b border-zinc-100">
                      <td className="py-3 font-bold text-sm text-zinc-900">{c.code}</td>
                      <td className="py-3 text-sm text-rose-500 font-bold">{c.discountValue}% OFF</td>
                      <td className="py-3 text-[11px] text-zinc-500">{new Date(c.validUntil).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${c.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-rose-50 text-rose-600"}`}>
                          {c.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* WALLET BONUS */}
        <div className="mt-8 bg-white border border-zinc-300 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
            <h2 className="text-[11px] font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-500" />
              Direct Wallet Bonus
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleGiveBonus} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">User Email</label>
                <input type="email" value={bonusEmail} onChange={(e)=>setBonusEmail(e.target.value)} placeholder="customer@example.com" className="w-full border border-zinc-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" required />
              </div>
              <div className="w-32">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Amount (Rs)</label>
                <input type="number" value={bonusAmt} onChange={(e)=>setBonusAmt(Number(e.target.value))} className="w-full border border-zinc-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" required min="1" />
              </div>
              <button type="submit" className="bg-emerald-600 text-white font-bold text-[11px] uppercase tracking-wider px-6 py-2.5 rounded hover:bg-emerald-700 transition-colors h-[38px]">Send Bonus</button>
            </form>
          </div>
        </div>

      </main>
    </div>
  );
}
