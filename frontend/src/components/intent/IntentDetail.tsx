'use client';

import { intentService } from '@/services/intent.service';
import type { Intent } from '@/types/intent';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import IntentDetailHeader from './IntentDetailHeader';

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
      <div className="flex items-center justify-center p-12 min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">Loading intent details...</div>
        </div>
      </div>
    );
  }

  if (error && !intent) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[50vh] space-y-6">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl shadow-sm font-medium border border-red-100">
          {error}
        </div>
        <Button onClick={handleBack} variant="outline">
          Back to Intents
        </Button>
      </div>
    );
  }

  if (!intent) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[50vh] space-y-6 text-center">
        <div className="bg-gray-50 text-gray-600 px-6 py-4 rounded-2xl shadow-sm font-medium border border-gray-100">
          Intent not found
        </div>
        <Button onClick={handleBack} variant="outline">
          Back to Intents
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <IntentDetailHeader 
        name={intent.name}
        isFulfillment={intent.isFulfillment}
        intentId={intent._id}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleting={deleting}
      />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl shadow-sm text-sm font-medium">
          {error}
        </div>
      )}

      {/* Training Phrases Section */}
      <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="mb-6">
          <h3 className="text-xl font-extrabold text-gray-900">
            Training Phrases ({intent.trainingPhrases.length})
          </h3>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Examples of what users might say to trigger this intent
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {intent.trainingPhrases.map((phrase, index) => (
            <div
              key={index}
              className="px-4 py-3 bg-blue-50/50 text-gray-800 rounded-2xl border border-blue-100/50 flex gap-3 items-start shadow-sm"
            >
              <span className="text-blue-500 font-bold text-sm bg-white w-6 h-6 flex items-center justify-center rounded-full shadow-sm shrink-0">
                {index + 1}
              </span>
              <span className="font-medium text-sm leading-relaxed">&quot;{phrase}&quot;</span>
            </div>
          ))}
        </div>
      </div>

      {/* Responses Section */}
      <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="mb-6">
          <h3 className="text-xl font-extrabold text-gray-900">
            Bot Responses ({intent.responses.length})
          </h3>
          <p className="text-sm font-medium text-gray-500 mt-1">
            {intent.isFulfillment
              ? 'Responses are handled by the webhook endpoint'
              : 'The bot will randomly select one of these responses'}
          </p>
        </div>

        {intent.responses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {intent.responses.map((response, index) => (
              <div
                key={index}
                className="px-4 py-3 bg-green-50/50 text-gray-800 rounded-2xl border border-green-100/50 flex gap-3 items-start shadow-sm"
              >
                <span className="text-green-500 font-bold text-sm bg-white w-6 h-6 flex items-center justify-center rounded-full shadow-sm shrink-0">
                  {index + 1}
                </span>
                <span className="font-medium text-sm leading-relaxed">{response}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-2xl text-center">
            <span className="text-gray-500 text-sm font-medium">
              No static responses configured (using webhook only)
            </span>
          </div>
        )}
      </div>

      {/* Webhook Configuration Section */}
      {intent.isFulfillment && (
        <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-extrabold text-gray-900 mb-6">
            Webhook Configuration
          </h3>
          
          <div className="space-y-6">
            <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 shadow-sm">
              <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">
                Webhook URL
              </label>
              <code className="block w-full px-4 py-3 bg-white text-gray-900 rounded-xl text-sm font-medium break-all shadow-sm border border-gray-200">
                {intent.webhookUrl || 'Not configured'}
              </code>
            </div>

            {intent.webhookHeaders && intent.webhookHeaders.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 px-1">
                  Webhook Headers ({intent.webhookHeaders.length})
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {intent.webhookHeaders.map((header, index) => {
                    const [key, value] = Object.entries(header)[0];
                    return (
                      <div
                        key={index}
                        className="px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-2 shadow-sm"
                      >
                        <span className="font-mono text-sm font-bold text-gray-800 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
                          {key}
                        </span>
                        <div className="flex items-center text-gray-400 font-bold hidden md:block">:</div>
                        <span className="font-mono text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm overflow-hidden text-ellipsis">
                          {String(value)}
                        </span>
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
      <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-extrabold text-gray-900 mb-6">Metadata</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider block mb-1">Created At</span>
            <div className="font-semibold text-gray-900">
              {new Date(intent.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider block mb-1">Last Updated</span>
            <div className="font-semibold text-gray-900">
              {new Date(intent.updatedAt).toLocaleDateString()}
            </div>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider block mb-1">Bot ID</span>
            <div className="font-mono text-xs font-semibold text-gray-900 break-all p-1.5 bg-white rounded-lg border border-gray-200">
              {intent.botId}
            </div>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider block mb-1">Owner ID</span>
            <div className="font-mono text-xs font-semibold text-gray-900 break-all p-1.5 bg-white rounded-lg border border-gray-200">
              {intent.ownerId}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
