"use client";

import BotIntegration from '@/components/bot/BotIntegration';
import { withAuth } from '@/lib/withAuth';

interface PageProps {
  params: Promise<{
    botId: string;
  }>;
}

async function IntegrationPage({ params }: PageProps) {
  const { botId } = await params;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BotIntegration botId={botId} />
    </div>
  );
}

export default withAuth(IntegrationPage);
