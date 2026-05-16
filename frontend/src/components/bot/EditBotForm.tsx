'use client';

import { botService } from '@/services/bot.service';
import type { Bot, EditBotDto } from '@/types/bot';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import FormIntro from '../ui/FormIntro';
import { Input } from '../ui/Input';
import LoadingState from '../ui/LoadingState';

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
    return <LoadingState message="Loading bot..." />;
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
      <FormIntro
        title="Edit Bot"
        description="Update your bot's core settings."
        error={error}
        successMessage={successMessage}
      />

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
             <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/bots/${botId}`)}
            className="flex-1 py-3 text-base font-semibold rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1 py-3 text-base font-semibold rounded-xl">
            {loading ? 'Updating...' : 'Update Bot'}
          </Button>
       
        </div>
      </form>
    </div>
  );
}
