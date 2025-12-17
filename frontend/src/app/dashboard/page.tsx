'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Dashboard</h2>
          <p className="text-slate-700 text-lg">
            Welcome to your AI Chatbot Builder dashboard!
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button 
              onClick={() => router.push('/dashboard/bots')}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-blue-400 transition-all text-left"
            >
              <h3 className="font-semibold text-slate-900 text-lg">Your Bots</h3>
              <p className="text-slate-600 mt-2">Manage your chatbots</p>
            </button>
            <button 
              onClick={() => router.push('/dashboard/bots/create')}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-blue-400 transition-all text-left"
            >
              <h3 className="font-semibold text-slate-900 text-lg">Create New Bot</h3>
              <p className="text-slate-600 mt-2">Build a new chatbot</p>
            </button>
            <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-slate-900 text-lg">Analytics</h3>
              <p className="text-slate-600 mt-2">View your bot statistics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
