'use client';

import { withAuth } from '@/lib/withAuth';
import { use } from 'react';

interface SettingsPageProps {
  params: Promise<{ botId: string }>;
}

function SettingsPage({ params }: SettingsPageProps) {
  const { botId } = use(params);
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bot Settings</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Configure advanced settings for your bot.</p>
          </div>
          
          <div className="mt-8 bg-white/70 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
            Advanced settings coming soon...
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(SettingsPage);
