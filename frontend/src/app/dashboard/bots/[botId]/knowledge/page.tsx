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
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Knowledge Base</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Upload and manage documents to train your bot with custom knowledge.
          </p>
        </div>
      </div>

      <KnowledgeUpload botId={botId} onUploadSuccess={handleUploadSuccess} />
      
      <KnowledgeList botId={botId} refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default withAuth(KnowledgePage);
