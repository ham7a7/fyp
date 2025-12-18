'use client';

import { botService } from '@/services/bot.service';
import type { Bot } from '@/types/bot';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';

export default function BotList() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingBotId, setDeletingBotId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await botService.getAllBots();
      setBots(response.bots);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bots');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBot = async (botId: string) => {
    if (!confirm('Are you sure you want to delete this bot?')) return;

    try {
      setDeletingBotId(botId);
      setError('');
      await botService.deleteBot({ botId });
      setBots(bots.filter(bot => bot._id !== botId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete bot');
    } finally {
      setDeletingBotId(null);
    }
  };

  const handleViewBot = (botId: string) => {
    router.push(`/dashboard/bots/${botId}`);
  };

  const handleEditBot = (botId: string) => {
    router.push(`/dashboard/bots/${botId}/edit`);
  };

  const handleCreateBot = () => {
    router.push('/dashboard/bots/create');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading bots...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Bots</h2>
        <Button onClick={handleCreateBot}>
          Create New Bot
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {bots.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No bots created yet</p>
          <Button onClick={handleCreateBot}>
            Create Your First Bot
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <div
              key={bot._id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{bot.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {bot.description}
                  </p>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Use case:</span> {bot.usecase}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Language:</span> {bot.language}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                      bot.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {bot.status}
                    </span>
                  </p>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    onClick={() => handleViewBot(bot._id)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditBot(bot._id)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBot(bot._id)}
                    disabled={deletingBotId === bot._id}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {deletingBotId === bot._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
