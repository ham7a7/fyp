"use client";
import EditIntentForm from '@/components/intent/EditIntentForm';
import { withAuth } from '@/lib/withAuth';

interface PageProps {
  params: Promise<{
    botId: string;
    intentId: string;
  }>;
}

async function EditIntentPage({ params }: PageProps) {
  const { botId, intentId } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <EditIntentForm botId={botId} intentId={intentId} />
    </div>
  );
}

export default withAuth(EditIntentPage);
