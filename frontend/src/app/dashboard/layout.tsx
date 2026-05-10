'use client';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900 selection:bg-blue-200">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 cursor-pointer" onClick={() => router.push('/dashboard')}>
                AI Chatbot Builder
              </h1>
              <div className="hidden md:flex gap-6 items-center">
                {/* Dashboard link removed as requested */}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700 hidden sm:inline bg-gray-100 px-3 py-1.5 rounded-full">
                👋 {user?.name}
              </span>
              <div className={pathname?.match(/\/dashboard\/bots\/[^\/]+/) ? 'hidden md:block' : 'block'}>
                <Button onClick={logout} variant="outline" size="sm" className="!h-9 !px-4">
                  Logout
                </Button>
              </div>
              <div id="mobile-menu-portal" className="md:hidden flex items-center"></div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
