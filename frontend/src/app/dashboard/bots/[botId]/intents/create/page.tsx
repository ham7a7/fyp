'use client';

import CreateIntentForm from '@/components/intent/CreateIntentForm';
import { withAuth } from '@/lib/withAuth';
import { use } from 'react';

interface CreateIntentPageProps {
  params: Promise<{ botId: string }>;
}

function CreateIntentPage({ params }: CreateIntentPageProps) {
  const { botId } = use(params);
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <CreateIntentForm botId={botId} />
      </div>
    </div>
  );
}

export default withAuth(CreateIntentPage);
