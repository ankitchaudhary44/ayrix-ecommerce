'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import HelpdeskWidget from '@/components/HelpdeskWidget';

export const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  // Check if we are on a dashboard route
  const isDashboardRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/pm');

  if (isDashboardRoute) {
    return (
      <div className="flex min-h-screen bg-zinc-50 w-full">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-x-hidden flex flex-col">
          <main className="flex-1 w-full bg-zinc-50">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Standard Consumer Layout
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">{children}</main>
      <HelpdeskWidget />
      <Footer />
    </>
  );
};
