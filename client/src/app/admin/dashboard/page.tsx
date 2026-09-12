'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { 
  Users, Box, ShoppingCart, RefreshCcw, ShieldAlert, 
  Settings, Database, Server, Mail, HardDrive, CheckCircle2,
  AlertTriangle, Shield, Search, MoreVertical, Edit, Lock,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState<any>({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalReturns: 0 });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>({ backend: 'Loading', database: 'Loading', gemini: 'Loading', smtp: 'Loading' });
  const [users, setUsers] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponVal, setNewCouponVal] = useState(10);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, healthRes, usersRes, couponsRes] = await Promise.all([
        api.get<any>('/admin/dashboard-stats'),
        api.get<any>('/admin/system-health'),
        api.get<any>("/admin/system-health"),
        api.get<any>("/admin/users"),
        api.get<any>("/coupons")

      ]);

      setStats(statsRes.stats);
      setAuditLogs(statsRes.auditLogs);
      setSystemHealth(healthRes);
      setUsers(usersRes.users.slice(0, 5)); setCoupons(couponsRes.coupons); // show latest 5
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
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
      fetchAdminData();
    } catch(err) { alert("Failed to create coupon"); }
  };

  const topStats = [
    { title: 'TOTAL USERS', value: stats.totalUsers.toLocaleString(), icon: <Users className="w-5 h-5 text-zinc-500" /> },
    { title: 'TOTAL PRODUCTS', value: stats.totalProducts.toLocaleString(), icon: <Box className="w-5 h-5 text-zinc-500" /> },
    { title: 'TOTAL ORDERS', value: stats.totalOrders.toLocaleString(), icon: <ShoppingCart className="w-5 h-5 text-zinc-500" /> },
    { title: 'TOTAL RETURNS', value: stats.totalReturns.toLocaleString(), icon: <RefreshCcw className="w-5 h-5 text-zinc-500" /> }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F5] font-sans">
      {/* Enterprise Header */}
      <header className="bg-slate-900 text-white shrink-0 border-b border-slate-800">
        <div className="px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              AYRIX System Administration
            </h1>
            <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Operations & Infrastructure</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">System Active</span>
            </div>
            <div className="h-8 w-8 rounded bg-emerald-600 flex items-center justify-center text-sm font-bold border border-emerald-500 shadow-inner">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        
        {/* Top KPIs (Square, Dense, Professional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 bg-white border border-zinc-300 shadow-sm">
          {topStats.map((stat, idx) => (
            <div key={idx} className={`p-6 flex flex-col \${idx !== 3 ? 'border-r border-zinc-200' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{stat.title}</span>
                {stat.icon}
              </div>
              <span className="text-3xl font-bold text-zinc-900 tracking-tight">{loading ? '...' : stat.value}</span>
            </div>
          ))}
        </div>

        {/* System Health Overview */}
        <div className="bg-white border border-zinc-300 shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
            <h2 className="text-[11px] font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-500" />
              Infrastructure Status
            </h2>
            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">Run Diagnostics</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-zinc-200">
            <div className="p-6 flex items-start gap-4 hover:bg-zinc-50 transition-colors">
              <Server className={`w-6 h-6 \${systemHealth.backend === 'Online' ? 'text-emerald-600' : 'text-zinc-400'}`} />
              <div>
                <div className="text-[13px] font-bold text-zinc-900">API Server</div>
                <div className={`text-[10px] font-bold uppercase mt-1 tracking-wider \${systemHealth.backend === 'Online' ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {systemHealth.backend}
                </div>
              </div>
            </div>
            <div className="p-6 flex items-start gap-4 hover:bg-zinc-50 transition-colors">
              <Database className={`w-6 h-6 \${systemHealth.database === 'Connected' ? 'text-emerald-600' : 'text-zinc-400'}`} />
              <div>
                <div className="text-[13px] font-bold text-zinc-900">MongoDB Atlas</div>
                <div className={`text-[10px] font-bold uppercase mt-1 tracking-wider \${systemHealth.database === 'Connected' ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {systemHealth.database}
                </div>
              </div>
            </div>
            <div className="p-6 flex items-start gap-4 hover:bg-zinc-50 transition-colors">
              <HardDrive className={`w-6 h-6 \${systemHealth.gemini === 'Operational' ? 'text-emerald-600' : 'text-rose-500'}`} />
              <div>
                <div className="text-[13px] font-bold text-zinc-900">AI Engine (Gemini)</div>
                <div className={`text-[10px] font-bold uppercase mt-1 tracking-wider \${systemHealth.gemini === 'Operational' ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {systemHealth.gemini}
                </div>
              </div>
            </div>
            <div className="p-6 flex items-start gap-4 hover:bg-zinc-50 transition-colors">
              <Mail className={`w-6 h-6 \${systemHealth.smtp === 'Connected' ? 'text-emerald-600' : 'text-amber-500'}`} />
              <div>
                <div className="text-[13px] font-bold text-zinc-900">SMTP Relay</div>
                <div className={`text-[10px] font-bold uppercase mt-1 tracking-wider \${systemHealth.smtp === 'Connected' ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {systemHealth.smtp}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* User Management */}
          <div className="bg-white border border-zinc-300 shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
              <h2 className="text-[11px] font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-500" />
                User Directory (RBAC)
              </h2>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search database..." 
                  className="pl-9 pr-3 py-1.5 text-[11px] font-medium border border-zinc-300 focus:outline-none focus:border-zinc-500 bg-white shadow-inner"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 border-b border-zinc-300 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    <th className="px-6 py-3">Account</th>
                    <th className="px-6 py-3">Privilege Role</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {users.map((u, i) => (
                    <tr key={i} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-zinc-900">{u.name}</div>
                        <div className="text-[11px] text-zinc-500 font-medium">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-bold px-2 py-0.5 border uppercase tracking-widest \${
                          u.role === 'admin' ? 'bg-zinc-900 text-white border-zinc-900' :
                          u.role === 'product_manager' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-zinc-100 text-zinc-600 border-zinc-200'
                        }`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-3 items-center">
                        <button 
                          onClick={async () => {
                            const amt = prompt(`Enter bonus amount for ${u.name}:`);
                            if(amt && !isNaN(Number(amt))) {
                              try {
                                await fetch('http://localhost:5001/api/payment/admin/credit-wallet', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('ayrix_token')}` },
                                  body: JSON.stringify({ userId: u.id, amount: Number(amt), description: 'Admin Bonus' })
                                });
                                alert('Bonus credited successfully');
                              } catch(e) {}
                            }
                          }}
                          className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded hover:bg-emerald-100 transition-colors uppercase tracking-wider"
                        >
                          + Bonus
                        </button>
                        <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !loading && (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-zinc-500 text-[13px]">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-3 text-center">
              <Link href="/admin/users" className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-900">View Full Directory →</Link>
            </div>
          </div>

          {/* Security & Access Logs */}
          <div className="bg-white border border-zinc-300 shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
              <h2 className="text-[11px] font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-4 h-4 text-zinc-500" />
                Security Audit Trail
              </h2>
              <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">Export CSV</button>
            </div>
            <div className="divide-y divide-zinc-200 flex-1">
              {auditLogs.map((log, i) => (
                <div key={i} className="px-6 py-4 hover:bg-zinc-50 transition-colors flex items-start gap-4">
                  <div className={`mt-0.5 \${
                    log.type === 'warning' ? 'text-amber-500' :
                    log.type === 'danger' ? 'text-rose-500' :
                    'text-zinc-400'
                  }`}>
                    {log.type === 'info' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-zinc-900">{log.action}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{log.user}</span>
                      <span className="text-[10px] text-zinc-400 font-medium">{log.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              {auditLogs.length === 0 && !loading && (
                <div className="px-6 py-8 text-center text-zinc-500 text-[13px]">No audit logs found.</div>
              )}
            </div>
          </div>
        </div>

        {/* COUPON MANAGEMENT */}
        <div className="mt-8 bg-white border border-zinc-200 rounded shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
            <h2 className="text-[11px] font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-500" />
              Discount Coupons
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 border-r border-zinc-100 pr-6">
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Coupon Code</label>
                  <input type="text" value={newCouponCode} onChange={(e)=>setNewCouponCode(e.target.value)} placeholder="e.g. FESTIVAL50" className="w-full border border-zinc-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-rose-500" required />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Discount %</label>
                  <input type="number" value={newCouponVal} onChange={(e)=>setNewCouponVal(Number(e.target.value))} className="w-full border border-zinc-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-rose-500" required min="1" max="100" />
                </div>
                <button type="submit" className="w-full bg-zinc-900 text-white font-bold text-[11px] uppercase tracking-wider py-2.5 rounded hover:bg-zinc-800 transition-colors">Generate Coupon</button>
              </form>
            </div>
            <div className="col-span-2 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200 text-[10px] uppercase text-zinc-500">
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
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${c.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
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

      </main>
    </div>
  );
}
