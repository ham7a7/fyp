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
    <BotDetail botId={botId} />
  );
}

export default withAuth(BotDetailPage);
