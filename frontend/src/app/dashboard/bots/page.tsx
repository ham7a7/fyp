"use client";
import BotList from '@/components/bot/BotList';
import { withAuth } from '@/lib/withAuth';

function BotsPage() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <BotList />
      </div>
    </div>
  );
}

export default withAuth(BotsPage);
