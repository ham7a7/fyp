'use client';

import { botService } from '@/services/bot.service';
import type { CreateBotDto } from '@/types/bot';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/Button';
import FormIntro from '../ui/FormIntro';
import { Input } from '../ui/Input';

export default function CreateBotForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<CreateBotDto>({
    botName: '',
    botDescription: '',
    botUsecase: '',
    botLanguage: 'English',
  });

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
      const response = await botService.createBot(formData);
      setSuccessMessage(response.message);
      // Redirect after showing success
      setTimeout(() => {
        router.push('/dashboard/bots');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create bot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FormIntro
        title="Create New Bot"
        description="Set up the basics and launch your next AI assistant."
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
            required
            value={formData.botName}
            onChange={handleChange}
            placeholder="Enter bot name"
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
            required
            value={formData.botDescription}
            onChange={handleChange}
            placeholder="Describe what your bot does"
            rows={4}
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
            required
            value={formData.botUsecase}
            onChange={handleChange}
            placeholder="e.g., Customer Support, FAQ Assistant"
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
            onClick={() => router.push('/dashboard/bots')}
            className="flex-1 py-3 text-base font-semibold rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1 py-3 text-base font-semibold rounded-xl">
            {loading ? 'Creating...' : 'Create Bot'}
          </Button>
        </div>
      </form>
    </div>
  );
}
