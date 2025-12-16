'use client';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-blue-600">AI Chatbot Builder</h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-800 font-medium">Welcome, {user?.name}</span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Dashboard</h2>
            <p className="text-slate-700 text-lg">
              Welcome to your AI Chatbot Builder dashboard!
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-slate-900 text-lg">Your Bots</h3>
                <p className="text-slate-600 mt-2">Manage your chatbots</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-slate-900 text-lg">Create New Bot</h3>
                <p className="text-slate-600 mt-2">Build a new chatbot</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-slate-900 text-lg">Analytics</h3>
                <p className="text-slate-600 mt-2">View your bot statistics</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
