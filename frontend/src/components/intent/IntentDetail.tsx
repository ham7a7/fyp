'use client';

import { intentService } from '@/services/intent.service';
import type { Intent } from '@/types/intent';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';

interface IntentDetailProps {
  botId: string;
  intentId: string;
}

export default function IntentDetail({ botId, intentId }: IntentDetailProps) {
  const [intent, setIntent] = useState<Intent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadIntent();
  }, [botId, intentId]);

  const loadIntent = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await intentService.getIntent(botId, intentId);
      setIntent(response.intent);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load intent');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this intent? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      setError('');
      await intentService.deleteIntent(botId, { intentId });
      router.push(`/dashboard/bots/${botId}/intents`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete intent');
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/bots/${botId}/intents/${intentId}/edit`);
  };

  const handleBack = () => {
    router.push(`/dashboard/bots/${botId}/intents`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading intent details...</div>
      </div>
    );
  }

  if (error && !intent) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Intents
        </button>
      </div>
    );
  }

  if (!intent) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Intent not found</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Intents
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{intent.name}</h2>
          <div className="flex gap-2 mt-2">
            {intent.isFulfillment && (
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                🔗 Webhook Enabled
              </span>
            )}
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
              ID: {intent._id}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back
          </button>
          <Button onClick={handleEdit}>Edit</Button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Training Phrases Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Training Phrases ({intent.trainingPhrases.length})
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          These are examples of what users might say to trigger this intent
        </p>
        <div className="space-y-2">
          {intent.trainingPhrases.map((phrase, index) => (
            <div
              key={index}
              className="px-4 py-3 bg-blue-50 text-blue-900 rounded-lg border border-blue-200"
            >
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">{index + 1}.</span>
                <span>&quot;{phrase}&quot;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Responses Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Bot Responses ({intent.responses.length})
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {intent.isFulfillment
            ? 'Responses are handled by the webhook endpoint'
            : 'The bot will randomly select one of these responses'}
        </p>
        {intent.responses.length > 0 ? (
          <div className="space-y-2">
            {intent.responses.map((response, index) => (
              <div
                key={index}
                className="px-4 py-3 bg-green-50 text-green-900 rounded-lg border border-green-200"
              >
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-medium">{index + 1}.</span>
                  <span>{response}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm italic">
            No static responses configured (using webhook only)
          </div>
        )}
      </div>

      {/* Webhook Configuration Section */}
      {intent.isFulfillment && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Webhook Configuration
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <code className="block px-4 py-3 bg-gray-100 text-gray-900 rounded-lg text-sm break-all">
                {intent.webhookUrl || 'Not configured'}
              </code>
            </div>

            {intent.webhookHeaders && intent.webhookHeaders.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook Headers ({intent.webhookHeaders.length})
                </label>
                <div className="space-y-2">
                  {intent.webhookHeaders.map((header, index) => {
                    const [key, value] = Object.entries(header)[0];
                    return (
                      <div
                        key={index}
                        className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex gap-2">
                          <span className="font-mono text-sm font-medium text-gray-700">
                            {key}:
                          </span>
                          <span className="font-mono text-sm text-gray-600">
                            {String(value)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadata Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Metadata</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Created At:</span>
            <div className="font-medium text-gray-900 mt-1">
              {new Date(intent.createdAt).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Last Updated:</span>
            <div className="font-medium text-gray-900 mt-1">
              {new Date(intent.updatedAt).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Bot ID:</span>
            <div className="font-mono text-sm text-gray-900 mt-1 break-all">
              {intent.botId}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Owner ID:</span>
            <div className="font-mono text-sm text-gray-900 mt-1 break-all">
              {intent.ownerId}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
