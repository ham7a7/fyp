'use client';

import { API_BASE_URL } from '@/lib/api-client';
import { whatsappService } from '@/services/whatsapp.service';
import type { WhatsAppSettings } from '@/types/whatsapp';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface WhatsAppIntegrationProps {
  botId: string;
}

export default function WhatsAppIntegration({ botId }: WhatsAppIntegrationProps) {
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [appSecret, setAppSecret] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // Uses the internal bot ID, which never changes (the public bot ID can be refreshed)
  const webhookUrl = `${API_BASE_URL}/api/whatsapp/${botId}/webhook`;

  const applySettings = (newSettings: WhatsAppSettings) => {
    setSettings(newSettings);
    setEnabled(newSettings.enabled);
    setPhoneNumberId(newSettings.phoneNumberId);
    // Saved secrets are never shown again
    setAccessToken('');
    setAppSecret('');
  };

  useEffect(() => {
    whatsappService
      .getSettings(botId)
      .then((response) => applySettings(response.whatsappSettings))
      .catch((err) => setError(err.message || 'Failed to load WhatsApp settings'));
  }, [botId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await whatsappService.updateSettings({
        botId,
        enabled,
        phoneNumberId,
        ...(accessToken ? { accessToken } : {}),
        ...(appSecret ? { appSecret } : {}),
      });
      applySettings(response.whatsappSettings);
      setSuccess(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save WhatsApp settings');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-3xl p-8 shadow-sm">
      <h3 className="text-xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
        <span className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </span>
        WhatsApp
      </h3>
      <p className="text-sm font-medium text-gray-500 mb-6">
        Let customers chat with this bot on WhatsApp, through Meta&apos;s WhatsApp Business Cloud API.
        It uses the same intents, knowledge and memory as the website widget.
      </p>

      {!settings ? (
        error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        ) : (
          <p className="text-sm font-medium text-gray-500">Loading WhatsApp settings...</p>
        )
      ) : (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <span className="text-sm font-medium text-gray-700">
                Answer WhatsApp messages with this bot
              </span>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                aria-pressed={enabled}
                aria-label="Enable WhatsApp"
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  enabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    enabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <Input
              label="Phone number ID"
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
              placeholder="From WhatsApp > API Setup in Meta, e.g. 106540352242922"
              inputMode="numeric"
            />
            <Input
              label="Access token"
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder={settings.hasAccessToken ? 'Saved. Leave empty to keep it' : 'Permanent access token from Meta'}
              autoComplete="off"
            />
            <Input
              label="App secret"
              type="password"
              value={appSecret}
              onChange={(e) => setAppSecret(e.target.value)}
              placeholder={settings.hasAppSecret ? 'Saved. Leave empty to keep it' : 'From App settings > Basic in Meta'}
              autoComplete="off"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm font-medium">
                {success}
              </div>
            )}

            <Button type="submit" isLoading={saving}>
              Save WhatsApp settings
            </Button>
          </form>

          <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
            <h4 className="font-extrabold text-gray-900">Webhook setup in Meta</h4>
            {settings.verifyToken ? (
              <>
                {[
                  { label: 'Callback URL', value: webhookUrl },
                  { label: 'Verify token', value: settings.verifyToken },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
                    <div className="flex gap-3 items-center">
                      <code className="flex-1 min-w-0 truncate text-sm font-bold text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200">
                        {value}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(value, label)}
                        className="px-4 py-2 bg-gray-800 text-white font-bold text-sm rounded-xl hover:bg-gray-700 shadow-sm transition-colors"
                      >
                        {copied === label ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
                <ol className="list-decimal ml-5 space-y-1 text-sm font-medium text-gray-600">
                  <li>In Meta for Developers, open your app, then go to WhatsApp &gt; Configuration.</li>
                  <li>Paste the Callback URL and Verify token above, then click &quot;Verify and save&quot;.</li>
                  <li>Under Webhook fields, subscribe to &quot;messages&quot;.</li>
                  {API_BASE_URL.includes('localhost') && (
                    <li>
                      Meta can&apos;t reach localhost. While developing, run a tunnel such as{' '}
                      <code>cloudflared tunnel --url {API_BASE_URL}</code> and use its URL in place of {API_BASE_URL}.
                    </li>
                  )}
                </ol>
              </>
            ) : (
              <p className="text-sm font-medium text-gray-600">
                Save the settings once to get your webhook verify token.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
