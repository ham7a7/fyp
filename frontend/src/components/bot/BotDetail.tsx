'use client';

import { botService } from '@/services/bot.service';
import type { Bot } from '@/types/bot';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import BotHeader from './BotHeader';
import BotOverviewCard from './BotOverviewCard';

interface BotDetailProps {
  botId: string;
}

export default function BotDetail({ botId }: BotDetailProps) {
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadBot();
  }, [botId]);

  const loadBot = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await botService.getBotWithParam(botId);
      setBot(response.bot);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bot');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/bots/${botId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bot? This action cannot be undone.')) {
      return;
    }

    try {
      await botService.deleteBot({ botId });
      router.push('/dashboard/bots');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete bot');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">Loading bot details...</div>
        </div>
      </div>
    );
  }

  if (error && !bot) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[50vh] space-y-6">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl shadow-sm font-medium border border-red-100">
          {error}
        </div>
        <Button onClick={() => router.push('/dashboard/bots')} variant="outline">
          Back to Bots
        </Button>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[50vh] space-y-6 text-center">
        <div className="bg-gray-50 text-gray-600 px-6 py-4 rounded-2xl shadow-sm font-medium border border-gray-100">
          Bot not found
        </div>
        <Button onClick={() => router.push('/dashboard/bots')} variant="outline">
          Back to Bots
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BotHeader 
        name={bot.name}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl shadow-sm text-sm font-medium">
          {error}
        </div>
      )}

      <BotOverviewCard bot={bot} />
    </div>
  );
}
