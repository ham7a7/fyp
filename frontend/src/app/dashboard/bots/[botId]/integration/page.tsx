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
    <div className="container mx-auto px-4 py-8">
      <BotIntegration botId={botId} />
    </div>
  );
}

export default withAuth(IntegrationPage);
