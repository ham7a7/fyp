'use client';

import { intentService } from '@/services/intent.service';
import type { Intent } from '@/types/intent';
import { MessageSquare, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import IntentPageHeader from './IntentPageHeader';

interface IntentListProps {
  botId: string;
}

export default function IntentList({ botId }: IntentListProps) {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      if (err.response?.status === 404 || err.message?.includes('404')) {
        setError('Intent listing is not yet implemented in the backend. You can still create intents!');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load intents');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIntent = () => {
    router.push(`/dashboard/bots/${botId}/intents/create`);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">Loading intents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <IntentPageHeader onCreate={handleCreateIntent} />

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-2xl shadow-sm">
          <p className="font-bold mb-1">Note:</p>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {intents.length === 0 && !error ? (
        <div className="text-center py-16 bg-white/50 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2">No intents created yet</p>
          <p className="text-sm text-gray-500 font-medium mb-8 max-w-sm">
            Intents help your bot understand what users are asking for and how to accurately generate a response.
          </p>
          <Button onClick={handleCreateIntent}>
            Create Your First Intent
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {intents.map((intent) => (
            <div
              key={intent._id}
              onClick={() => router.push(`/dashboard/bots/${botId}/intents/${intent._id}`)}
              className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-blue-200 transition-all duration-200 cursor-pointer group"
            >
              <div className="space-y-5">
                {/* Intent Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">{intent.name}</h3>
                    {intent.isFulfillment && (
                      <span className="inline-flex items-center gap-1 mt-1 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100">
                        <Zap className="w-3 h-3" />
                        Webhook Enabled
                      </span>
                    )}
                  </div>
                </div>

                {/* Training Phrases snippet */}
                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-50">
                  <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                    Phrases ({intent.trainingPhrases.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {intent.trainingPhrases.slice(0, 3).map((phrase, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-full shadow-sm border border-gray-100 line-clamp-1 max-w-full"
                      >
                        "{phrase}"
                      </span>
                    ))}
                    {intent.trainingPhrases.length > 3 && (
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-600 font-bold text-xs rounded-full">
                        +{intent.trainingPhrases.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
