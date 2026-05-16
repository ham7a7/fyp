'use client';

import { intentService } from '@/services/intent.service';
import type { UpdateIntentDto } from '@/types/intent';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import FormIntro from '../ui/FormIntro';
import { Input } from '../ui/Input';

interface EditIntentFormProps {
  botId: string;
  intentId: string;
}

export default function EditIntentForm({ botId, intentId }: EditIntentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [trainingPhrases, setTrainingPhrases] = useState<string[]>(['']);
  const [responses, setResponses] = useState<string[]>(['']);
  const [isFulfillment, setIsFulfillment] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookHeaders, setWebhookHeaders] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    loadIntent();
  }, [botId, intentId]);

  const loadIntent = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await intentService.getIntent(botId, intentId);
      const intent = response.intent;

      // Populate form with existing data
      setName(intent.name);
      setTrainingPhrases(intent.trainingPhrases.length > 0 ? intent.trainingPhrases : ['']);
      setResponses(intent.responses.length > 0 ? intent.responses : ['']);
      setIsFulfillment(intent.isFulfillment);
      setWebhookUrl(intent.webhookUrl || '');
      
      // Convert webhook headers from Record<string, any>[] to { key, value }[]
      if (intent.webhookHeaders && intent.webhookHeaders.length > 0) {
        const headers = intent.webhookHeaders.map((header) => {
          const [key, value] = Object.entries(header)[0];
          return { key, value: String(value) };
        });
        setWebhookHeaders(headers);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load intent');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrainingPhrase = () => {
    setTrainingPhrases([...trainingPhrases, '']);
  };

  const handleRemoveTrainingPhrase = (index: number) => {
    if (trainingPhrases.length > 1) {
      setTrainingPhrases(trainingPhrases.filter((_, i) => i !== index));
    }
  };

  const handleTrainingPhraseChange = (index: number, value: string) => {
    const updated = [...trainingPhrases];
    updated[index] = value;
    setTrainingPhrases(updated);
  };

  const handleAddResponse = () => {
    setResponses([...responses, '']);
  };

  const handleRemoveResponse = (index: number) => {
    if (responses.length > 1) {
      setResponses(responses.filter((_, i) => i !== index));
    }
  };

  const handleResponseChange = (index: number, value: string) => {
    const updated = [...responses];
    updated[index] = value;
    setResponses(updated);
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
    setError('');
    setSuccess('');

    // Validation
    if (!name.trim()) {
      setError('Intent name is required');
      return;
    }

    const validTrainingPhrases = trainingPhrases.filter((phrase) => phrase.trim() !== '');
    if (validTrainingPhrases.length === 0) {
      setError('At least one training phrase is required');
      return;
    }

    const validResponses = responses.filter((response) => response.trim() !== '');
    if (!isFulfillment && validResponses.length === 0) {
      setError('At least one response is required when webhook is not enabled');
      return;
    }

    if (isFulfillment && !webhookUrl.trim()) {
      setError('Webhook URL is required when webhook is enabled');
      return;
    }

    try {
      setSubmitting(true);

      // Convert webhook headers back to Record<string, any>[]
      const formattedHeaders = webhookHeaders
        .filter((h) => h.key.trim() && h.value.trim())
        .map((h) => ({ [h.key]: h.value }));

      const updateData: UpdateIntentDto = {
        intentId,
        name: name.trim(),
        trainingPhrases: validTrainingPhrases,
        responses: validResponses,
        isFulfillment,
        webhookUrl: isFulfillment ? webhookUrl.trim() : undefined,
        webhookHeaders: isFulfillment && formattedHeaders.length > 0 ? formattedHeaders : undefined,
      };

      await intentService.updateIntent(botId, updateData);
      setSuccess('Intent updated successfully!');
      
      // Redirect back to intents list after a short delay
      setTimeout(() => {
        router.push(`/dashboard/bots/${botId}/intents`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update intent');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading intent...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    
      <FormIntro
        title="Edit Intent"
        description="Update the intent configuration for your bot."
        error={error}
        successMessage={success}
      />

      <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm p-8 space-y-10">
        {/* Intent Name */}
        <div className="space-y-2">
          <label className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Intent Name *
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., greeting, product_inquiry"
            required
            className="w-full bg-white transition-all bg-gray-50 focus:bg-white"
          />
        </div>

        {/* Training Phrases */}
        <div className="space-y-3 pt-6 border-t border-gray-100">
          <label className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
            Training Phrases *
          </label>
          <p className="text-sm font-medium text-gray-500 mb-3">
            Add examples of what users might say to trigger this intent.
          </p>
          <div className="space-y-3">
            {trainingPhrases.map((phrase, index) => (
              <div key={index} className="flex gap-3 items-center bg-gray-50/50 p-2 rounded-2xl border border-gray-100/50">
                <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full text-blue-600 font-bold shadow-sm text-sm border border-gray-100">
                  {index + 1}
                </span>
                <Input
                  type="text"
                  value={phrase}
                  onChange={(e) => handleTrainingPhraseChange(index, e.target.value)}
                  placeholder="e.g., Hello, Hi there, Good morning"
                  className="flex-1 bg-white border-0 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTrainingPhrase(index)}
                  disabled={trainingPhrases.length === 1}
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
            onClick={handleAddTrainingPhrase}
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
            Responses {!isFulfillment && <span className="text-red-500">*</span>}
          </label>
          <p className="text-sm font-medium text-gray-500 mb-3">
            How the bot should respond when this intent is triggered.
          </p>
          <div className="space-y-3">
            {responses.map((response, index) => (
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
                  onClick={() => handleRemoveResponse(index)}
                  disabled={responses.length === 1}
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
            onClick={handleAddResponse}
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
              checked={isFulfillment}
              onChange={(e) => setIsFulfillment(e.target.checked)}
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="isFulfillment" className="block text-base font-bold text-purple-900 cursor-pointer">
              Enable Webhook Fulfillment
            </label>
            <p className="text-sm font-medium text-purple-600/70 ml-auto hidden sm:block">
              Send requests to an external API
            </p>
          </div>

          {isFulfillment && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-2">
                <label className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                  Webhook URL *
                </label>
                <Input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
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
            disabled={submitting}
            className="w-full sm:w-auto px-8"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto px-8 shadow-sm hover:shadow-md transition-shadow">
            {submitting ? 'Updating Intent...' : 'Update Intent'}
          </Button>
        </div>
      </form>
    </div>
  );
}
