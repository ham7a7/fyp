'use client';

import { botService } from '@/services/bot.service';
import type { Bot, EditBotDto } from '@/types/bot';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface EditBotFormProps {
  botId: string;
}

export default function EditBotForm({ botId }: EditBotFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [bot, setBot] = useState<Bot | null>(null);

  const [formData, setFormData] = useState<Omit<EditBotDto, 'botId'>>({
    botName: '',
    botDescription: '',
    botUsecase: '',
    botLanguage: '',
  });

  useEffect(() => {
    loadBot();
  }, [botId]);

  const loadBot = async () => {
    try {
      setFetchLoading(true);
      const response = await botService.getBotWithParam(botId);
      setBot(response.bot);
      setFormData({
        botName: response.bot.name,
        botDescription: response.bot.description,
        botUsecase: response.bot.usecase,
        botLanguage: response.bot.language,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bot');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await botService.editBot({
        botId,
        ...formData,
      });
      setSuccessMessage(response.message);
      
      setTimeout(() => {
        router.push(`/dashboard/bots/${botId}`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update bot');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading bot...</div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Bot not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Bot</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="botName" className="block text-sm font-medium text-gray-700 mb-1">
            Bot Name
          </label>
          <Input
            id="botName"
            name="botName"
            type="text"
            value={formData.botName}
            onChange={handleChange}
            placeholder="Enter bot name"
          />
        </div>

        <div>
          <label htmlFor="botDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="botDescription"
            name="botDescription"
            value={formData.botDescription}
            onChange={handleChange}
            placeholder="Describe what your bot does"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="botUsecase" className="block text-sm font-medium text-gray-700 mb-1">
            Use Case
          </label>
          <Input
            id="botUsecase"
            name="botUsecase"
            type="text"
            value={formData.botUsecase}
            onChange={handleChange}
            placeholder="e.g., Customer Support, FAQ Assistant"
          />
        </div>

        <div>
          <label htmlFor="botLanguage" className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            id="botLanguage"
            name="botLanguage"
            value={formData.botLanguage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
            <option value="Arabic">Arabic</option>
            <option value="Portuguese">Portuguese</option>
            <option value="Hindi">Hindi</option>
            <option value="Urdu">Urdu</option>
          </select>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Updating...' : 'Update Bot'}
          </Button>
          <button
            type="button"
            onClick={() => router.push(`/dashboard/bots/${botId}`)}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
