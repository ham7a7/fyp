'use client';

import EditBotForm from '@/components/bot/EditBotForm';
import { withAuth } from '@/lib/withAuth';
import { use } from 'react';

interface EditBotPageProps {
  params: Promise<{ botId: string }>;
}

function EditBotPage({ params }: EditBotPageProps) {
  const { botId } = use(params);
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 w-full">
        <EditBotForm botId={botId} />
      </div>
    </div>
  );
}

export default withAuth(EditBotPage);
