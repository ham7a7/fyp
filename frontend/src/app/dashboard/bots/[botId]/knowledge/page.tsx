'use client';

import KnowledgeList from '@/components/knowledge/KnowledgeList';
import KnowledgeUpload from '@/components/knowledge/KnowledgeUpload';
import { withAuth } from '@/lib/withAuth';
import { use, useState } from 'react';

interface PageProps {
  params: Promise<{
    botId: string;
  }>;
}

function KnowledgePage({ params }: PageProps) {
  const { botId } = use(params);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger refresh of the document list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
        <p className="text-gray-600">
          Upload and manage documents to train your bot with custom knowledge
        </p>
      </div>

      <KnowledgeUpload botId={botId} onUploadSuccess={handleUploadSuccess} />
      
      <KnowledgeList botId={botId} refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default withAuth(KnowledgePage);
