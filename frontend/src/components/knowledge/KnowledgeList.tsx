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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">Loading documents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Knowledge Base Documents</h3>
          <p className="text-sm text-gray-600 mt-1">
            {documents.length} {documents.length === 1 ? 'document' : 'documents'} uploaded
          </p>
        </div>
        <button
          onClick={() => router.push(`/dashboard/bots/${botId}`)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Bot
        </button>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {documents.length === 0 && !error ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
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
          <p className="text-gray-600 mb-2">No documents uploaded yet</p>
          <p className="text-sm text-gray-500">
            Upload documents above to build your bot&apos;s knowledge base
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">{getFileIcon(doc.fileType)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate" title={doc.title}>
                    {doc.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileType(doc.fileType)}
                  </p>
                  {doc.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {doc.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(doc._id, doc.title)}
                  disabled={deletingId === doc._id}
                  className="flex-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
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
