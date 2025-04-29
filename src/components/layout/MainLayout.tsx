import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        {/* Sidebar para desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Sidebar móvil con overlay */}
        {isSidebarOpen && (
          <div className="md:hidden">
            {/* Overlay oscuro */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-20"
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Sidebar móvil */}
            <div className="fixed inset-y-0 left-0 z-30">
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}