'use client';

import { intentService } from '@/services/intent.service';
import type { Intent } from '@/types/intent';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';

interface IntentListProps {
  botId: string;
}

export default function IntentList({ botId }: IntentListProps) {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingIntentId, setDeletingIntentId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadIntents();
  }, [botId]);

  const loadIntents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await intentService.getAllIntents(botId);
      setIntents(response.intents);
    } catch (err: any) {
      // If the endpoint doesn't exist yet, show a helpful message
      if (err.response?.status === 404 || err.message?.includes('404')) {
        setError('Intent listing is not yet implemented in the backend. You can still create intents!');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load intents');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIntent = async (intentId: string) => {
    if (!confirm('Are you sure you want to delete this intent?')) return;

    try {
      setDeletingIntentId(intentId);
      setError('');
      await intentService.deleteIntent(botId, { intentId });
      setIntents(intents.filter(intent => intent._id !== intentId));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete intent');
    } finally {
      setDeletingIntentId(null);
    }
  };

  const handleCreateIntent = () => {
    router.push(`/dashboard/bots/${botId}/intents/create`);
  };

  const handleBackToBots = () => {
    router.push(`/dashboard/bots/${botId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading intents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bot Intents</h2>
          <p className="text-sm text-gray-600 mt-1">
            Train your bot to understand and respond to user queries
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleBackToBots}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back to Bot
          </button>
          <Button onClick={handleCreateIntent}>
            Create New Intent
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          <p className="font-medium">Note:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {intents.length === 0 && !error ? (
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">No intents created yet</p>
          <p className="text-sm text-gray-500 mb-6">
            Intents help your bot understand what users are asking for
          </p>
          <Button onClick={handleCreateIntent}>
            Create Your First Intent
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {intents.map((intent) => (
            <div
              key={intent._id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* Intent Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{intent.name}</h3>
                    {intent.isFulfillment && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                        Webhook Enabled
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/bots/${botId}/intents/${intent._id}`)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/bots/${botId}/intents/${intent._id}/edit`)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteIntent(intent._id)}
                      disabled={deletingIntentId === intent._id}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingIntentId === intent._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>

                {/* Training Phrases */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Training Phrases ({intent.trainingPhrases.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {intent.trainingPhrases.slice(0, 5).map((phrase, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                      >
                        &quot;{phrase}&quot;
                      </span>
                    ))}
                    {intent.trainingPhrases.length > 5 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        +{intent.trainingPhrases.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Responses */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Responses ({intent.responses.length})
                  </h4>
                  <div className="space-y-2">
                    {intent.responses.slice(0, 2).map((response, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 bg-green-50 text-green-800 text-sm rounded border border-green-200"
                      >
                        {response}
                      </div>
                    ))}
                    {intent.responses.length > 2 && (
                      <span className="text-sm text-gray-600">
                        +{intent.responses.length - 2} more response(s)
                      </span>
                    )}
                  </div>
                </div>

                {/* Webhook Info */}
                {intent.isFulfillment && intent.webhookUrl && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Webhook URL</h4>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
                      {intent.webhookUrl}
                    </code>
                  </div>
                )}

                {/* Metadata */}
                <div className="pt-3 border-t text-xs text-gray-500">
                  Created: {new Date(intent.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
