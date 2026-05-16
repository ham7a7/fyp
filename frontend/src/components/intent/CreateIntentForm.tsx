'use client';

import { intentService } from '@/services/intent.service';
import type { CreateIntentDto } from '@/types/intent';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/Button';
import FormIntro from '../ui/FormIntro';
import { Input } from '../ui/Input';

interface CreateIntentFormProps {
  botId: string;
}

export default function CreateIntentForm({ botId }: CreateIntentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [webhookHeaders, setWebhookHeaders] = useState<{ key: string; value: string }[]>([]);

  const [formData, setFormData] = useState<CreateIntentDto>({
    name: '',
    trainingPhrases: [''],
    responses: [''],
    isFulfillment: false,
    webhookUrl: '',
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

  const handleAddWebhookHeader = () => {
    setWebhookHeaders([...webhookHeaders, { key: '', value: '' }]);
  };

  const handleRemoveWebhookHeader = (index: number) => {
    setWebhookHeaders(webhookHeaders.filter((_, i) => i !== index));
  };

  const handleWebhookHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...webhookHeaders];
    updated[index][field] = value;
    setWebhookHeaders(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Convert webhook headers
    const formattedHeaders = webhookHeaders
      .filter((h) => h.key.trim() && h.value.trim())
      .map((h) => ({ [h.key]: h.value }));

    // Filter out empty training phrases and responses
    const cleanedData = {
      ...formData,
      trainingPhrases: formData.trainingPhrases.filter(phrase => phrase.trim() !== ''),
      responses: formData.responses.filter(response => response.trim() !== ''),
      webhookUrl: formData.isFulfillment ? formData.webhookUrl : undefined,
      webhookHeaders: formData.isFulfillment && formattedHeaders.length > 0 ? formattedHeaders : undefined,
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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FormIntro
        title="Create New Intent"
        description="Teach your bot how to handle a specific user request."
        onCancel={() => router.push(`/dashboard/bots/${botId}/intents`)}
        error={error}
        successMessage={successMessage}
      />

      <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm p-8 space-y-10">
        
        {/* Intent Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Intent Name *
          </label>
          <p className="text-sm font-medium text-gray-500 mb-3">
            A unique name that identifies this intent internally (e.g., <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded">greeting</code>).
          </p>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., product_inquiry"
            className="w-full bg-white transition-all bg-gray-50 focus:bg-white"
          />
        </div>

        {/* Training Phrases */}
        <div className="space-y-3 pt-6 border-t border-gray-100">
          <label className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Training Phrases *
          </label>
          <p className="text-sm font-medium text-gray-500 mb-3">
            Examples of what users might say to trigger this intent.
          </p>
          <div className="space-y-3">
            {formData.trainingPhrases.map((phrase, index) => (
              <div key={index} className="flex gap-3 items-center bg-gray-50/50 p-2 rounded-2xl border border-gray-100/50">
                <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full text-blue-600 font-bold shadow-sm text-sm border border-gray-100">
                  {index + 1}
                </span>
                <Input
                  value={phrase}
                  onChange={(e) => handleTrainingPhraseChange(index, e.target.value)}
                  placeholder={`e.g., "Hello", "Hi there", "Good morning"`}
                  className="flex-1 bg-white border-0 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeTrainingPhrase(index)}
                  disabled={formData.trainingPhrases.length === 1}
                  className="shrink-0 p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTrainingPhrase}
            className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Phrase
          </button>
        </div>

        {/* Responses */}
        <div className="space-y-3 pt-6 border-t border-gray-100">
          <label className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Responses *
          </label>
          <p className="text-sm font-medium text-gray-500 mb-3">
            How the bot should respond when this intent is triggered.
          </p>
          <div className="space-y-3">
            {formData.responses.map((response, index) => (
              <div key={index} className="flex gap-3 items-start bg-green-50/20 p-3 rounded-2xl border border-green-100/50">
                <span className="shrink-0 mt-1 w-8 h-8 flex items-center justify-center bg-white rounded-full text-green-600 font-bold shadow-sm text-sm border border-gray-100">
                  {index + 1}
                </span>
                <textarea
                  value={response}
                  onChange={(e) => handleResponseChange(index, e.target.value)}
                  placeholder={`e.g., "Hello! How can I help you today?"`}
                  rows={2}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 placeholder:text-gray-400 text-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeResponse(index)}
                  disabled={formData.responses.length === 1}
                  className="shrink-0 mt-1 p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addResponse}
            className="mt-4 px-5 py-2.5 bg-green-50 text-green-700 font-bold text-sm rounded-xl hover:bg-green-100 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Response
          </button>
        </div>

        {/* Webhook/Fulfillment */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-6 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
            <input
              type="checkbox"
              id="isFulfillment"
              name="isFulfillment"
              checked={formData.isFulfillment}
              onChange={handleChange}
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="isFulfillment" className="block text-base font-bold text-purple-900 cursor-pointer">
              Enable Webhook Fulfillment
            </label>
            <p className="text-sm font-medium text-purple-600/70 ml-auto hidden sm:block">
              Send requests to an external API
            </p>
          </div>

          {formData.isFulfillment && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-2">
                <label htmlFor="webhookUrl" className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                  Webhook URL *
                </label>
                <Input
                  id="webhookUrl"
                  name="webhookUrl"
                  type="url"
                  required={formData.isFulfillment}
                  value={formData.webhookUrl}
                  onChange={handleChange}
                  placeholder="https://api.yourdomain.com/webhook"
                  className="w-full bg-gray-50 focus:bg-white"
                />
                <p className="mt-1 text-xs text-gray-500 font-medium">
                  The bot will call this URL to get the response dynamically.
                </p>
              </div>

              <div className="pt-4">
                <label className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-3">
                  Webhook Headers
                </label>
                <div className="space-y-3">
                  {webhookHeaders.map((header, index) => (
                    <div key={index} className="flex gap-3 items-center bg-gray-50/50 p-2 rounded-2xl border border-gray-100/50">
                      <Input
                        type="text"
                        value={header.key}
                        onChange={(e) => handleWebhookHeaderChange(index, 'key', e.target.value)}
                        placeholder="e.g., Authorization"
                        className="flex-1 bg-white border-0 shadow-sm"
                      />
                      <Input
                        type="text"
                        value={header.value}
                        onChange={(e) => handleWebhookHeaderChange(index, 'value', e.target.value)}
                        placeholder="e.g., Bearer token..."
                        className="flex-1 bg-white border-0 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveWebhookHeader(index)}
                        className="shrink-0 p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
                      >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddWebhookHeader}
                  className="mt-4 px-5 py-2.5 bg-blue-50 text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Header
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/bots/${botId}/intents`)}
            className="w-full sm:w-auto px-8"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 shadow-sm hover:shadow-md transition-shadow"
          >
            {loading ? 'Creating Intent...' : 'Create Intent'}
          </Button>
        </div>
      </form>
    </div>
  );
}
