'use client';

import { knowledgeService } from '@/services/knowledge.service';
import { useState } from 'react';
import { Button } from '../ui/Button';

interface KnowledgeUploadProps {
  botId: string;
  onUploadSuccess?: () => void;
}

export default function KnowledgeUpload({ botId, onUploadSuccess }: KnowledgeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const ACCEPTED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setError('');
    setSuccess('');

    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload PDF, DOC, DOCX, TXT, CSV, or image files (JPEG, PNG, GIF, WebP).');
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      await knowledgeService.uploadDocument(botId, file);
      
      setSuccess(`Successfully uploaded "${file.name}"`);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">Upload Knowledge Document</h3>
        <p className="text-sm font-medium text-gray-500">
          Upload documents and images to train your bot. Supported formats: PDF, DOC, DOCX, TXT, CSV, Images (JPEG, PNG, GIF, WebP) • Max 10MB
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl shadow-sm text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl shadow-sm text-sm font-medium flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50/50 shadow-inner'
            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
        }`}
      >
        <input
          id="file-input"
          type="file"
          onChange={handleFileInput}
          accept=".pdf,.doc,.docx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp"
          className="hidden"
          disabled={uploading}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {file ? (
            <div className="space-y-3">
              <p className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">Selected file:</p>
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 shadow-sm rounded-xl">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">{file.name}</p>
                  <p className="text-xs font-medium text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="ml-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={uploading}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-500 font-medium">
                Drag and drop your file here, or
              </p>
              <label
                htmlFor="file-input"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-200 text-gray-900 font-bold shadow-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-all"
              >
                Browse Files
              </label>
            </>
          )}

          <p className="text-xs font-medium text-gray-400 mt-2">
            Supported: PDF, DOC, DOCX, TXT, CSV, JPEG, PNG, GIF, WebP • Max size: 10MB
          </p>
        </div>
      </div>

      {/* Upload Button */}
      {file && (
        <div className="flex justify-end pt-4">
          <Button onClick={handleUpload} disabled={uploading} className="px-8 shadow-sm">
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload Document'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
