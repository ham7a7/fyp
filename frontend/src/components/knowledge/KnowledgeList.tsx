'use client';

import { knowledgeService } from '@/services/knowledge.service';
import type { Knowledge } from '@/types/knowledge';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface KnowledgeListProps {
  botId: string;
  refreshTrigger?: number;
}

export default function KnowledgeList({ botId, refreshTrigger }: KnowledgeListProps) {
  const [documents, setDocuments] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadDocuments();
  }, [botId, refreshTrigger]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await knowledgeService.getAllDocuments(botId);
      setDocuments(response.knowledge || []);
    } catch (err: any) {
      // If endpoint doesn't exist yet, show friendly message
      if (err.response?.status === 404) {
        setError('Knowledge listing endpoint not yet available');
        setDocuments([]);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load documents');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (knowledgeId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      setDeletingId(knowledgeId);
      setError('');
      await knowledgeService.deleteDocument(botId, knowledgeId);
      setDocuments(documents.filter(doc => doc._id !== knowledgeId));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete document');
    } finally {
      setDeletingId(null);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return (
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return (
        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    } else if (fileType.includes('text') || fileType.includes('csv')) {
      return (
        <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    );
  };

  const formatFileType = (mimeType: string): string => {
    const typeMap: Record<string, string> = {
      'application/pdf': 'PDF',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'text/plain': 'TXT',
      'text/csv': 'CSV',
    };
    return typeMap[mimeType] || 'Document';
  };

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500 font-medium">Loading documents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Knowledge Base Documents</h3>
          <p className="text-sm font-medium text-gray-500 mt-1">
            {documents.length} {documents.length === 1 ? 'document' : 'documents'} uploaded
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 px-6 py-4 rounded-2xl shadow-sm">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {documents.length === 0 && !error ? (
        <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-gray-100/50 shadow-inner">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-900 font-bold mb-2">No documents uploaded yet</p>
          <p className="text-sm text-gray-500 font-medium">
            Upload documents above to build your bot&apos;s knowledge base.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-gray-50 p-2 rounded-xl border border-gray-100">{getFileIcon(doc.fileType)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-gray-900 truncate" title={doc.title}>
                    {doc.title}
                  </h4>
                  <p className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg mt-2">
                    {formatFileType(doc.fileType)}
                  </p>
                  {doc.description && (
                    <p className="text-xs font-medium text-gray-500 mt-2 line-clamp-2">
                      {doc.description}
                    </p>
                  )}
                  <p className="text-xs font-medium text-gray-400 mt-3">
                    Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-6 flex gap-3">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-bold bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(doc._id, doc.title)}
                  disabled={deletingId === doc._id}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-bold bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {deletingId === doc._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
