'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, Users, Activity, Settings, LogOut, ArrowLeft, 
  LineChart, AlertTriangle, Box, Tags, MessageSquare, TestTube, 
  Lightbulb, ShoppingCart, RefreshCcw, ShieldAlert, HeartPulse, Shield
} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  const isPM = user?.role === 'product_manager';

  const pmNavItems = [
    { title: 'Dashboard', href: '/pm/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Analytics', href: '/pm/analytics', icon: <LineChart className="w-5 h-5" /> },
    { title: 'Fit Performance', href: '/pm/fit-performance', icon: <Activity className="w-5 h-5" /> },
    { title: 'Return Risk', href: '/pm/return-risk', icon: <AlertTriangle className="w-5 h-5" /> },
    { title: 'Products', href: '/pm/products', icon: <Box className="w-5 h-5" /> },
    { title: 'Categories & Brands', href: '/pm/categories', icon: <Tags className="w-5 h-5" /> },
    { title: 'Customer Feedback', href: '/pm/feedback', icon: <MessageSquare className="w-5 h-5" /> },
    { title: 'Experiments', href: '/pm/experiments', icon: <TestTube className="w-5 h-5" /> },
    { title: 'Insights', href: '/pm/insights', icon: <Lightbulb className="w-5 h-5" /> }
  ];

  const adminNavItems = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Users', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { title: 'Products', href: '/admin/products', icon: <Box className="w-5 h-5" /> },
    { title: 'Orders', href: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { title: 'Returns', href: '/admin/returns', icon: <RefreshCcw className="w-5 h-5" /> },
    { title: 'Fit Feedback', href: '/admin/feedback', icon: <MessageSquare className="w-5 h-5" /> },
    { title: 'Admins & Roles', href: '/admin/roles', icon: <Shield className="w-5 h-5" /> },
    { title: 'Audit Logs', href: '/admin/logs', icon: <ShieldAlert className="w-5 h-5" /> },
    { title: 'System Health', href: '/admin/health', icon: <HeartPulse className="w-5 h-5" /> },
    { title: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const navItems = isAdmin ? adminNavItems : isPM ? pmNavItems : [];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col font-sans border-r border-slate-800 shrink-0">
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="block">
          <h1 className="font-extrabold text-2xl tracking-[0.1em] text-white uppercase group-hover:opacity-80 transition-opacity flex items-center gap-2">
            AYRIX
          </h1>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">
            {isAdmin ? 'System Administration' : 'Product Intelligence'}
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && item.href !== '/pm/dashboard' && pathname.startsWith(item.href));
          return (
            <Link 
              key={idx} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all \${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link 
          href="/shop"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Store
        </Link>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all text-left"
        >
          <LogOut className="w-5 h-5" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
};
