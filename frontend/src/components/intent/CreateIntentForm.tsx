'use client';

import { intentService } from '@/services/intent.service';
import type { CreateIntentDto } from '@/types/intent';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CreateIntentFormProps {
  botId: string;
}

export default function CreateIntentForm({ botId }: CreateIntentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<CreateIntentDto>({
    name: '',
    trainingPhrases: [''],
    responses: [''],
    isFulfillment: false,
    webhookUrl: '',
    webhookHeaders: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleTrainingPhraseChange = (index: number, value: string) => {
    const newPhrases = [...formData.trainingPhrases];
    newPhrases[index] = value;
    setFormData({ ...formData, trainingPhrases: newPhrases });
  };

  const addTrainingPhrase = () => {
    setFormData({
      ...formData,
      trainingPhrases: [...formData.trainingPhrases, ''],
    });
  };

  const removeTrainingPhrase = (index: number) => {
    if (formData.trainingPhrases.length > 1) {
      const newPhrases = formData.trainingPhrases.filter((_, i) => i !== index);
      setFormData({ ...formData, trainingPhrases: newPhrases });
    }
  };

  const handleResponseChange = (index: number, value: string) => {
    const newResponses = [...formData.responses];
    newResponses[index] = value;
    setFormData({ ...formData, responses: newResponses });
  };

  const addResponse = () => {
    setFormData({
      ...formData,
      responses: [...formData.responses, ''],
    });
  };

  const removeResponse = (index: number) => {
    if (formData.responses.length > 1) {
      const newResponses = formData.responses.filter((_, i) => i !== index);
      setFormData({ ...formData, responses: newResponses });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Filter out empty training phrases and responses
    const cleanedData = {
      ...formData,
      trainingPhrases: formData.trainingPhrases.filter(phrase => phrase.trim() !== ''),
      responses: formData.responses.filter(response => response.trim() !== ''),
      webhookUrl: formData.isFulfillment ? formData.webhookUrl : undefined,
      webhookHeaders: formData.isFulfillment ? formData.webhookHeaders : undefined,
    };

    // Validation
    if (cleanedData.trainingPhrases.length === 0) {
      setError('At least one training phrase is required');
      setLoading(false);
      return;
    }

    if (cleanedData.responses.length === 0) {
      setError('At least one response is required');
      setLoading(false);
      return;
    }

    try {
      const response = await intentService.createIntent(botId, cleanedData);
      setSuccessMessage(response.message);
      
      // Redirect after showing success
      setTimeout(() => {
        router.push(`/dashboard/bots/${botId}/intents`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create intent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Intent</h2>

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
        {/* Intent Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Intent Name *
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., greeting, product_inquiry, pricing_question"
          />
          <p className="mt-1 text-xs text-gray-500">
            A unique name that identifies this intent
          </p>
        </div>

        {/* Training Phrases */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Training Phrases *
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Examples of what users might say to trigger this intent
          </p>
          <div className="space-y-2">
            {formData.trainingPhrases.map((phrase, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={phrase}
                  onChange={(e) => handleTrainingPhraseChange(index, e.target.value)}
                  placeholder={`e.g., "Hello", "Hi there", "Good morning"`}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeTrainingPhrase(index)}
                  disabled={formData.trainingPhrases.length === 1}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTrainingPhrase}
            className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            + Add Training Phrase
          </button>
        </div>

        {/* Responses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responses *
          </label>
          <p className="text-xs text-gray-500 mb-3">
            How the bot should respond when this intent is triggered
          </p>
          <div className="space-y-2">
            {formData.responses.map((response, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  value={response}
                  onChange={(e) => handleResponseChange(index, e.target.value)}
                  placeholder={`e.g., "Hello! How can I help you today?"`}
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 placeholder:text-gray-400 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeResponse(index)}
                  disabled={formData.responses.length === 1}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addResponse}
            className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            + Add Response
          </button>
        </div>

        {/* Webhook/Fulfillment */}
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isFulfillment"
              name="isFulfillment"
              checked={formData.isFulfillment}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isFulfillment" className="ml-2 block text-sm font-medium text-gray-700">
              Use Webhook for Response (Advanced)
            </label>
          </div>

          {formData.isFulfillment && (
            <div className="ml-6 space-y-4">
              <div>
                <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL
                </label>
                <Input
                  id="webhookUrl"
                  name="webhookUrl"
                  type="url"
                  value={formData.webhookUrl}
                  onChange={handleChange}
                  placeholder="https://your-webhook-endpoint.com/api"
                />
                <p className="mt-1 text-xs text-gray-500">
                  The bot will call this URL to get the response dynamically
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Creating...' : 'Create Intent'}
          </Button>
          <button
            type="button"
            onClick={() => router.push(`/dashboard/bots/${botId}/intents`)}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
