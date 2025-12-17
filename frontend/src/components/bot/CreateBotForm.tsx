'use client';

import { botService } from '@/services/bot.service';
import type { CreateBotDto } from '@/types/bot';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export default function CreateBotForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('');

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
      setApiKey(response.apiKey);
      setShowApiKey(true);
      
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

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    alert('API Key copied to clipboard!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Bot</h2>

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

      {showApiKey && apiKey && (
        <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded mb-4">
          <p className="text-blue-900 font-semibold mb-2">⚠️ Important: Save your API Key</p>
          <p className="text-blue-800 text-sm mb-2">
            This is the only time you'll see this API key. Make sure to copy and save it securely.
          </p>
          <div className="flex gap-2 items-center">
            <code className="flex-1 bg-white px-3 py-2 rounded border border-blue-300 text-sm break-all">
              {apiKey}
            </code>
            <button
              onClick={copyApiKey}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="botName" className="block text-sm font-medium text-gray-700 mb-1">
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
          />
        </div>

        <div>
          <label htmlFor="botDescription" className="block text-sm font-medium text-gray-700 mb-1">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="botUsecase" className="block text-sm font-medium text-gray-700 mb-1">
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
          />
        </div>

        <div>
          <label htmlFor="botLanguage" className="block text-sm font-medium text-gray-700 mb-1">
            Language *
          </label>
          <select
            id="botLanguage"
            name="botLanguage"
            value={formData.botLanguage}
            onChange={handleChange}
            required
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
            {loading ? 'Creating...' : 'Create Bot'}
          </Button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/bots')}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
