'use client';

import { intentService } from '@/services/intent.service';
import type { UpdateIntentDto } from '@/types/intent';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Intent</h2>
        <p className="text-sm text-gray-600 mt-1">
          Update the intent configuration for your bot
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Intent Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intent Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., greeting, product_inquiry"
            required
          />
        </div>

        {/* Training Phrases */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Training Phrases <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Add examples of what users might say to trigger this intent
          </p>
          <div className="space-y-2">
            {trainingPhrases.map((phrase, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="text"
                  value={phrase}
                  onChange={(e) => handleTrainingPhraseChange(index, e.target.value)}
                  placeholder="e.g., Hello, Hi there, Good morning"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTrainingPhrase(index)}
                  disabled={trainingPhrases.length === 1}
                  className="px-3 py-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddTrainingPhrase}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Training Phrase
          </button>
        </div>

        {/* Responses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bot Responses {!isFulfillment && <span className="text-red-500">*</span>}
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Define how the bot should respond when this intent is detected
          </p>
          <div className="space-y-2">
            {responses.map((response, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="text"
                  value={response}
                  onChange={(e) => handleResponseChange(index, e.target.value)}
                  placeholder="e.g., Hello! How can I help you today?"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveResponse(index)}
                  disabled={responses.length === 1}
                  className="px-3 py-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddResponse}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Response
          </button>
        </div>

        {/* Webhook Settings */}
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isFulfillment"
              checked={isFulfillment}
              onChange={(e) => setIsFulfillment(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="isFulfillment" className="ml-2 text-sm font-medium text-gray-700">
              Use Webhook for Response
            </label>
          </div>

          {isFulfillment && (
            <div className="space-y-4 ml-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook URL <span className="text-red-500">*</span>
                </label>
                <Input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-webhook-endpoint.com/handle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook Headers (Optional)
                </label>
                <div className="space-y-2">
                  {webhookHeaders.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="text"
                        value={header.key}
                        onChange={(e) => handleWebhookHeaderChange(index, 'key', e.target.value)}
                        placeholder="Header name"
                        className="flex-1"
                      />
                      <Input
                        type="text"
                        value={header.value}
                        onChange={(e) => handleWebhookHeaderChange(index, 'value', e.target.value)}
                        placeholder="Header value"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveWebhookHeader(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddWebhookHeader}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Header
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-6 border-t">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Intent'}
          </Button>
          <button
            type="button"
            onClick={() => router.push(`/dashboard/bots/${botId}/intents`)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
