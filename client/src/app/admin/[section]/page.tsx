'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Search, Filter, Download, MoreVertical, LayoutGrid, Shield } from 'lucide-react';

export default function AdminSectionPage() {
  const params = useParams();
  const section = params.section as string;
  const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ');

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F5] font-sans">
      <header className="bg-slate-900 text-white shrink-0 border-b border-slate-800">
        <div className="px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              AYRIX System Administration
            </h1>
            <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Manage {sectionTitle}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">System Active</span>
            </div>
            <div className="h-8 w-8 rounded bg-emerald-600 flex items-center justify-center text-sm font-bold border border-emerald-500 shadow-inner">
              A
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{sectionTitle}</h2>
            <p className="text-[13px] text-zinc-500 mt-1 font-medium">Viewing all records for {sectionTitle.toLowerCase()}.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white border border-zinc-300 text-zinc-700 px-4 py-2 rounded text-[13px] font-bold flex items-center gap-2 hover:bg-zinc-50 shadow-sm transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="bg-white border border-zinc-300 text-zinc-700 px-4 py-2 rounded text-[13px] font-bold flex items-center gap-2 hover:bg-zinc-50 shadow-sm transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded text-[13px] font-bold shadow-sm hover:bg-emerald-700 transition-colors">
              + New Record
            </button>
          </div>
        </div>

        <div className="bg-white border border-zinc-300 shadow-sm flex flex-col min-h-[500px]">
          <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
            <div className="relative w-96">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder={`Search \${sectionTitle.toLowerCase()}...`}
                className="w-full pl-9 pr-3 py-2 text-[12px] font-medium border border-zinc-300 focus:outline-none focus:border-zinc-500 bg-white shadow-inner"
              />
            </div>
            <div className="flex gap-2">
              <button className="p-1.5 border border-zinc-300 rounded text-zinc-500 bg-zinc-100"><LayoutGrid className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-12">
            <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-sm font-bold text-zinc-700 mb-1">No {sectionTitle.toLowerCase()} found</p>
            <p className="text-[13px]">Select "New Record" to populate this dataset.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
