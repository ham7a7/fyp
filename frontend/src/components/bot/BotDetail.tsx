'use client';

import { botService } from '@/services/bot.service';
import type { Bot } from '@/types/bot';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';

interface BotDetailProps {
  botId: string;
}

export default function BotDetail({ botId }: BotDetailProps) {
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshingApiKey, setRefreshingApiKey] = useState(false);
  const [refreshingBotId, setRefreshingBotId] = useState(false);
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

  const handleRefreshApiKey = async () => {
    if (!confirm('Are you sure you want to refresh the API key? The old key will stop working immediately.')) {
      return;
    }

    try {
      setRefreshingApiKey(true);
      setError('');
      const response = await botService.refreshAPIKey({ botId });
      setBot(response.bot);
      alert(`New API Key: ${response.apiKey}\n\nPlease save this key. You won't be able to see it again.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to refresh API key');
    } finally {
      setRefreshingApiKey(false);
    }
  };

  const handleRefreshBotId = async () => {
    if (!confirm('Are you sure you want to refresh the public bot ID? The old ID will stop working immediately.')) {
      return;
    }

    try {
      setRefreshingBotId(true);
      setError('');
      const response = await botService.refreshPublicBotId({ botId });
      setBot(response.bot);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to refresh bot ID');
    } finally {
      setRefreshingBotId(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
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
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading bot details...</div>
      </div>
    );
  }

  if (error && !bot) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => router.push('/dashboard/bots')}>
          Back to Bots
        </Button>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 mb-4">Bot not found</p>
        <Button onClick={() => router.push('/dashboard/bots')}>
          Back to Bots
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">{bot.name}</h2>
        <div className="flex gap-2">
          <Button onClick={handleEdit}>Edit</Button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => router.push(`/dashboard/bots/${botId}/intents`)}
          className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
        >
          <h4 className="font-semibold text-blue-900 mb-1">Manage Intents</h4>
          <p className="text-sm text-blue-700">
            Train your bot to understand user queries
          </p>
        </button>
        <button
          onClick={() => router.push(`/dashboard/bots/${botId}/knowledge`)}
          className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
        >
          <h4 className="font-semibold text-green-900 mb-1">Knowledge Base</h4>
          <p className="text-sm text-green-700">
            Upload documents and data for your bot
          </p>
        </button>
        <button
          onClick={() => router.push(`/dashboard/bots/${botId}/integration`)}
          className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
        >
          <h4 className="font-semibold text-purple-900 mb-1">Integration & API</h4>
          <p className="text-sm text-purple-700">
            Get widget code and API credentials
          </p>
        </button>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <p className="mt-1 text-gray-900">{bot.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Use Case</label>
            <p className="mt-1 text-gray-900">{bot.usecase}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <p className="mt-1 text-gray-900">{bot.language}</p>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Created At</label>
            <p className="mt-1 text-sm text-gray-600">
              {new Date(bot.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Updated At</label>
            <p className="mt-1 text-sm text-gray-600">
              {new Date(bot.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
            bot.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-300 text-gray-800'
          }`}>
            {bot.status}
          </span>
        </div>
      </div>

      {/* API Credentials */}
      {/* <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">API Credentials</h3>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Public Bot ID</label>
            <button
              onClick={handleRefreshBotId}
              disabled={refreshingBotId}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {refreshingBotId ? 'Refreshing...' : 'Refresh ID'}
            </button>
          </div>
          <div className="flex gap-2">
            <code className="flex-1 bg-gray-50 px-4 py-2 rounded border border-gray-300 text-sm break-all">
              {bot.publicBotId}
            </code>
            <button
              onClick={() => copyToClipboard(bot.publicBotId, 'Public Bot ID')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Copy
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Use this ID to integrate the bot into your website widget
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">API Key</label>
            <button
              onClick={handleRefreshApiKey}
              disabled={refreshingApiKey}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {refreshingApiKey ? 'Refreshing...' : 'Refresh Key'}
            </button>
          </div>
          <div className="flex gap-2">
            <code className="flex-1 bg-gray-50 px-4 py-2 rounded border border-gray-300 text-sm break-all">
              {bot.apiKey}
            </code>
            <button
              onClick={() => copyToClipboard(bot.apiKey, 'API Key')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Copy
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Use this key for mobile and backend integrations (x-api-key header)
          </p>
        </div>
      </div> */}

      {/* Metadata */}
      {/* <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Metadata</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bot ID</label>
            <p className="mt-1 text-sm text-gray-600 break-all">{bot._id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Owner ID</label>
            <p className="mt-1 text-sm text-gray-600 break-all">{bot.ownerId}</p>
          </div>
         
        </div>
      </div> */}

      <div className="flex justify-center">
        <button
          onClick={() => router.push('/dashboard/bots')}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Bots
        </button>
      </div>
    </div>
  );
}
