'use client';

import { botService } from '@/services/bot.service';
import type { Bot } from '@/types/bot';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BotIntegrationProps {
  botId: string;
}

export default function BotIntegration({ botId }: BotIntegrationProps) {
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadBot();
  }, [botId]);

  const loadBot = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await botService.getBot({botId});
      setBot(response.bot);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load bot');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading integration details...</div>
      </div>
    );
  }

  if (error || !bot) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error || 'Bot not found'}
        </div>
        <button
          onClick={() => router.push('/dashboard/bots')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Bots
        </button>
      </div>
    );
  }

  const widgetCode = `<script
  src="http://localhost:3000/widget.js"
  data-bot-id="${bot.publicBotId}">
</script>`;

  const apiExample = `// Using fetch API
fetch('http://localhost:3000/api/bots/chat-with-bot', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '${bot.apiKey}'
  },
  body: JSON.stringify({
    publicBotId: '${bot.publicBotId}',
    message: 'Hello, how can you help me?'
  })
})
.then(response => response.json())
.then(data => console.log(data.response));`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Integration & API</h2>
          <p className="text-gray-600 mt-2">
            Integrate {bot.name} into your website or application
          </p>
        </div>
        <button
          onClick={() => router.push(`/dashboard/bots/${botId}`)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Bot
        </button>
      </div>

      {/* API Credentials */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          API Credentials
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Public Bot ID
            </label>
            <div className="flex gap-2">
              <code className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-mono break-all text-gray-900">
                {bot.publicBotId}
              </code>
              <button
                onClick={() => copyToClipboard(bot.publicBotId, 'botId')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {copied === 'botId' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Use this ID to identify your bot in widget and API requests
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="flex gap-2">
              <code className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-mono break-all text-gray-900">
                {showApiKey ? bot.apiKey : `${bot.apiKey.slice(0, 8)}${'•'.repeat(24)}${bot.apiKey.slice(-4)}`}
              </code>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {showApiKey ? '👁️ Hide' : '👁️ Show'}
              </button>
              <button
                onClick={() => copyToClipboard(bot.apiKey, 'apiKey')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {copied === 'apiKey' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Keep this secret! Use it to authenticate API requests
            </p>
          </div>
        </div>
      </div>

      {/* Widget Integration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Website Widget Integration
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Step 1: Copy the Code</h4>
            <p className="text-sm text-gray-600 mb-3">
              Copy the following code snippet and paste it into your website&apos;s HTML, right before the closing <code className="bg-gray-100 px-1">&lt;/body&gt;</code> tag.
            </p>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{widgetCode}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(widgetCode, 'widget')}
                className="absolute top-2 right-2 px-3 py-1.5 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors"
              >
                {copied === 'widget' ? '✓ Copied' : 'Copy Code'}
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Step 2: Test</h4>
            <p className="text-sm text-gray-600">
              Open your website and you should see a chat bubble in the bottom-right corner. Click it to start chatting with your bot!
            </p>
          </div>
        </div>
      </div>

      {/* API Integration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Direct API Integration
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">API Endpoint</h4>
            <div className="flex gap-2 items-center mb-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">POST</span>
              <code className="text-sm text-gray-700">http://localhost:3000/api/bots/chat-with-bot</code>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Example Request</h4>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{apiExample}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(apiExample, 'api')}
                className="absolute top-2 right-2 px-3 py-1.5 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors"
              >
                {copied === 'api' ? '✓ Copied' : 'Copy Code'}
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Response Format</h4>
            <pre className="bg-gray-50 border border-gray-200 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`{
  "response": "Hello! I'm here to help you..."
}`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Important Notes
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span>🔒</span>
            <span>Never expose your API key in client-side code. Use it only in server-side requests.</span>
          </li>
          <li className="flex items-start gap-2">
            <span>🌐</span>
            <span>The widget automatically includes the bot ID, so no API key is needed for widget integration.</span>
          </li>
          <li className="flex items-start gap-2">
            <span>⚡</span>
            <span>For production, update the API URL to your deployed backend URL.</span>
          </li>
          <li className="flex items-start gap-2">
            <span>📊</span>
            <span>Monitor your bot&apos;s usage and performance through the dashboard.</span>
          </li>
        </ul>
      </div>

      {/* Test Widget Button */}
      <div className="text-center">
        <a
          href={`data:text/html;charset=utf-8,${encodeURIComponent(`
<!DOCTYPE html>
<html>
<head>
  <title>Test ${bot.name}</title>
</head>
<body>
  <h1>Test Page for ${bot.name}</h1>
  <p>The chat widget should appear in the bottom-right corner.</p>
  <script src="http://localhost:3000/widget.js" data-bot-id="${bot.publicBotId}"></script>
</body>
</html>
          `)}`}
          download={`test-${bot.name.toLowerCase().replace(/\s+/g, '-')}.html`}
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          📥 Download Test Page
        </a>
        <p className="text-sm text-gray-600 mt-2">
          Download a test HTML page to try your widget locally
        </p>
      </div>
    </div>
  );
}
