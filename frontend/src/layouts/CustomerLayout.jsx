import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100">
      <Header />
      <main className="flex-1 w-full">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}

