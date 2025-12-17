"use client";
import IntentDetail from '@/components/intent/IntentDetail';
import { withAuth } from '@/lib/withAuth';

interface PageProps {
  params: Promise<{
    botId: string;
    intentId: string;
  }>;
}

async function IntentDetailPage({ params }: PageProps) {
  const { botId, intentId } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <IntentDetail botId={botId} intentId={intentId} />
    </div>
  );
}

export default withAuth(IntentDetailPage);
