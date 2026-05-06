'use client';

import BotDetail from '@/components/bot/BotDetail';
import { withAuth } from '@/lib/withAuth';
import { use } from 'react';

interface BotDetailPageProps {
  params: Promise<{ botId: string }>;
}

function BotDetailPage({ params }: BotDetailPageProps) {
  const { botId } = use(params);
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <BotDetail botId={botId} />
      </div>
    </div>
  );
}

export default withAuth(BotDetailPage);
