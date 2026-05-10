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
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">My Bots</h2>
          <p className="text-gray-500 mt-1 font-medium text-lg">Manage and oversee your AI assistants</p>
        </div>
        <Button onClick={handleCreateBot}>
          Create New Bot
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-xl shadow-sm text-sm font-medium">
          {error}
        </div>
      )}

      {bots.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="text-6xl mb-6">🤖</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No bots yet</h3>
          <p className="text-gray-500 mb-8 font-medium max-w-sm">
            It looks like you haven't created any chatbots. Get started by building your very first AI assistant.
          </p>
          <Button onClick={handleCreateBot}>
            Create Your First Bot
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bots.map((bot) => (
            <div
              key={bot._id}
              onClick={() => handleViewBot(bot._id)}
              className="group cursor-pointer bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1" title={bot.name}>{bot.name}</h3>
                  <span className={`shrink-0 inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    bot.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {bot.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 font-medium line-clamp-2 h-10">
                  {bot.description || 'No description provided.'}
                </p>

                <div className="pt-2 space-y-2 text-sm text-gray-600 border-t border-gray-50">
                  <p className="flex justify-between items-center">
                    <span className="font-semibold text-gray-400">Use case</span> 
                    <span className="font-medium bg-gray-50 px-2 py-0.5 rounded-lg">{bot.usecase}</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="font-semibold text-gray-400">Language</span> 
                    <span className="font-medium bg-gray-50 px-2 py-0.5 rounded-lg">{bot.language}</span>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 flex gap-3 border-t border-gray-50">
                <button
                  onClick={() => handleViewBot(bot._id)}
                  className="flex-1 px-4 py-2.5 text-sm font-bold bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors w-full"
                >
                  View Bot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
