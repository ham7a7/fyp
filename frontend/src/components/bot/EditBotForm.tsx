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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Bot</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Update your bot's core settings.</p>
        </div>
        <Button onClick={() => router.push(`/dashboard/bots/${botId}`)} variant="outline" className="border-gray-200">
          Cancel
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl shadow-sm text-sm font-medium">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl shadow-sm text-sm font-medium flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm p-8 space-y-10">
        <div className="space-y-2">
          <label htmlFor="botName" className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Bot Name *
          </label>
          <Input
            id="botName"
            name="botName"
            type="text"
            value={formData.botName}
            onChange={handleChange}
            placeholder="Enter bot name"
            required
            className="w-full transition-all bg-gray-50 focus:bg-white"
          />
        </div>

        <div className="space-y-2 pt-6 border-t border-gray-100">
          <label htmlFor="botDescription" className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Description *
          </label>
          <textarea
            id="botDescription"
            name="botDescription"
            value={formData.botDescription}
            onChange={handleChange}
            placeholder="Describe what your bot does"
            rows={4}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2 pt-6 border-t border-gray-100">
          <label htmlFor="botUsecase" className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Use Case *
          </label>
          <Input
            id="botUsecase"
            name="botUsecase"
            type="text"
            value={formData.botUsecase}
            onChange={handleChange}
            placeholder="e.g., Customer Support, FAQ Assistant"
            required
            className="w-full transition-all bg-gray-50 focus:bg-white"
          />
        </div>

        <div className="space-y-2 pt-6 border-t border-gray-100">
          <label htmlFor="botLanguage" className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Language *
          </label>
          <select
            id="botLanguage"
            name="botLanguage"
            value={formData.botLanguage}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all text-gray-900"
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

        <div className="pt-6 border-t border-gray-100 flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1 py-3 text-base font-semibold rounded-xl">
            {loading ? 'Updating...' : 'Update Bot'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/bots/${botId}`)}
            className="flex-1 py-3 text-base font-semibold rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
