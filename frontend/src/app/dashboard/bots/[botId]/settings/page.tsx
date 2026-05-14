'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { withAuth } from '@/lib/withAuth';
import { botService } from '@/services/bot.service';
import type { Bot, EditBotDto } from '@/types/bot';
import { use, useEffect, useState } from 'react';

interface SettingsPageProps {
  params: Promise<{ botId: string }>;
}

function SettingsPage({ params }: SettingsPageProps) {
  const { botId } = use(params);
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const defaultWidgetSettings = {
    headerName: 'AI Assistant',
    primaryColor: '#667eea',
    darkMode: false,
    welcomeTitle: 'Welcome!',
    welcomeMessage: 'Hi there! How can I help you today?',
  };

  const [formData, setFormData] = useState<Omit<EditBotDto, 'botId'>>({
    widgetHeaderName: defaultWidgetSettings.headerName,
    widgetPrimaryColor: defaultWidgetSettings.primaryColor,
    widgetDarkMode: defaultWidgetSettings.darkMode,
    widgetWelcomeTitle: defaultWidgetSettings.welcomeTitle,
    widgetWelcomeMessage: defaultWidgetSettings.welcomeMessage,
  });

  useEffect(() => {
    const loadBot = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await botService.getBotWithParam(botId);
        setBot(response.bot);
        const widgetSettings = response.bot.widgetSettings || defaultWidgetSettings;
        setFormData({
          widgetHeaderName: widgetSettings.headerName || defaultWidgetSettings.headerName,
          widgetPrimaryColor: widgetSettings.primaryColor || defaultWidgetSettings.primaryColor,
          widgetDarkMode: widgetSettings.darkMode ?? defaultWidgetSettings.darkMode,
          widgetWelcomeTitle: widgetSettings.welcomeTitle || defaultWidgetSettings.welcomeTitle,
          widgetWelcomeMessage: widgetSettings.welcomeMessage || defaultWidgetSettings.welcomeMessage,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load bot settings');
      } finally {
        setLoading(false);
      }
    };

    loadBot();
  }, [botId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await botService.editBot({
        botId,
        ...formData,
      });
      setSuccessMessage(response.message || 'Widget settings updated');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update widget settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setFormData({
      widgetHeaderName: defaultWidgetSettings.headerName,
      widgetPrimaryColor: defaultWidgetSettings.primaryColor,
      widgetDarkMode: defaultWidgetSettings.darkMode,
      widgetWelcomeTitle: defaultWidgetSettings.welcomeTitle,
      widgetWelcomeMessage: defaultWidgetSettings.welcomeMessage,
    });
    setSuccessMessage('');
  };
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bot Settings</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Widget Settings: customize the widget appearance and welcome message.</p>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl shadow-sm text-sm font-medium">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-6 bg-green-50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl shadow-sm text-sm font-medium">
              {successMessage}
            </div>
          )}

          <div className="mt-8 bg-white/70 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm p-8">
            {loading ? (
              <div className="text-center text-gray-500">Loading widget settings...</div>
            ) : !bot ? (
              <div className="text-center text-red-600">Bot not found</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-lg font-extrabold text-gray-900">Widget Settings</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="widgetHeaderName" className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                      Header Name
                    </label>
                    <Input
                      id="widgetHeaderName"
                      name="widgetHeaderName"
                      type="text"
                      value={formData.widgetHeaderName}
                      onChange={handleChange}
                      placeholder="AI Assistant"
                      className="w-full transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="widgetPrimaryColor" className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                      Primary Color
                    </label>
                    <Input
                      id="widgetPrimaryColor"
                      name="widgetPrimaryColor"
                      type="color"
                      value={formData.widgetPrimaryColor}
                      onChange={handleChange}
                      className="w-full h-12 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="widgetDarkMode" className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                      Dark Mode
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <input
                        id="widgetDarkMode"
                        name="widgetDarkMode"
                        type="checkbox"
                        checked={Boolean(formData.widgetDarkMode)}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Enable dark mode for the widget
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="widgetWelcomeTitle" className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                      Welcome Title
                    </label>
                    <Input
                      id="widgetWelcomeTitle"
                      name="widgetWelcomeTitle"
                      type="text"
                      value={formData.widgetWelcomeTitle}
                      onChange={handleChange}
                      placeholder="Welcome!"
                      className="w-full transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="widgetWelcomeMessage" className="block text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                    Welcome Message
                  </label>
                  <textarea
                    id="widgetWelcomeMessage"
                    name="widgetWelcomeMessage"
                    value={formData.widgetWelcomeMessage}
                    onChange={handleChange}
                    placeholder="Hi there! How can I help you today?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetDefaults}
                    className="px-6"
                  >
                    Reset Defaults
                  </Button>
                  <Button type="submit" isLoading={saving} className="px-8">
                    Save Settings
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(SettingsPage);
