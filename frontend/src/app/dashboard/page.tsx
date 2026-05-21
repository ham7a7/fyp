'use client';

import BotList from '@/components/bot/BotList';
import { withAuth } from '@/lib/withAuth';

function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <BotList />
    </div>
  );
}

export default withAuth(DashboardPage);
