'use client';

import { Button } from './Button';

interface FormIntroProps {
  title: string;
  description?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  error?: string;
  successMessage?: string;
}

export default function FormIntro({
  title,
  description,
  onCancel,
  cancelLabel = 'Cancel',
  error,
  successMessage,
}: FormIntroProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm font-medium text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {onCancel && (
          <Button onClick={onCancel} variant="outline" className="border-gray-200">
            {cancelLabel}
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl shadow-sm text-sm font-medium">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl shadow-sm text-sm font-medium flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </div>
      )}
    </div>
  );
}
