'use client';

import IntentList from '@/components/intent/IntentList';
import { withAuth } from '@/lib/withAuth';
import { use } from 'react';

interface IntentsPageProps {
  params: Promise<{ botId: string }>;
}

function IntentsPage({ params }: IntentsPageProps) {
  const { botId } = use(params);
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <IntentList botId={botId} />
      </div>
    </div>
  );
}

export default withAuth(IntentsPage);
