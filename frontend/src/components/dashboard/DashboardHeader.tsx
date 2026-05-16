'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';


export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const userName = user?.name?.trim() || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) {
        return;
      }

      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <h1
              className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 cursor-pointer"
              onClick={() => router.push('/dashboard')}
            >
              AI Chatbot Builder
            </h1>
           
          </div>
          <div className="flex items-center gap-4">
            <div
              ref={menuRef}
              className={
                pathname?.match(/\/dashboard\/bots\/[^\/]+/)
                  ? 'hidden md:block relative'
                  : 'block relative'
              }
            >
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
               
                <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
                  {userName}
                </span>
                 <span className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {userInitial}
                </span>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white shadow-lg py-2"
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push('/dashboard/settings');
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    role="menuitem"
                  >
                    <User className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    User settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              )}
            </div>
            <div id="mobile-menu-portal" className="md:hidden flex items-center"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
