import type { Bot } from '@/types/bot';
import { Calendar, CheckCircle2, Clock, Globe, MessageSquare, Tag } from 'lucide-react';

interface BotOverviewCardProps {
  bot: Bot;
}

export default function BotOverviewCard({ bot }: BotOverviewCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
      
      {/* Top Banner / Description */}
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 mb-3 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Bot Overview
        </h3>
        <p className="text-gray-600 text-base leading-relaxed bg-blue-50/50 p-5 rounded-2xl border border-blue-50/50">
          {bot.description || 'No description provided for this bot.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Attributes Box */}
        <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-5 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Tag className="w-4 h-4 text-purple-500" />
              </div>
              <span className="font-semibold text-sm">Use Case</span>
            </div>
            <span className="font-bold text-gray-900 bg-white px-3 py-1.5 rounded-full text-sm shadow-sm border border-gray-100">
              {bot.usecase}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Globe className="w-4 h-4 text-green-500" />
              </div>
              <span className="font-semibold text-sm">Language</span>
            </div>
            <span className="font-bold text-gray-900 bg-white px-3 py-1.5 rounded-full text-sm shadow-sm border border-gray-100 uppercase">
              {bot.language}
            </span>
          </div>
        </div>

        {/* Timestamps Box */}
        <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-5 flex flex-col justify-center">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3 text-gray-500">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Calendar className="w-4 h-4 text-orange-500" />
              </div>
              <span className="font-semibold text-sm">Created</span>
            </div>
            <span className="font-bold text-gray-900 text-sm">
              {new Date(bot.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <span className="font-semibold text-sm">Last Update</span>
            </div>
            <span className="font-bold text-gray-900 text-sm">
               {new Date(bot.updatedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

      </div>

      {/* Footer / Status */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <span className="text-sm font-semibold text-gray-500">Current Status</span>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
          bot.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-600 border border-gray-200'
        }`}>
          {bot.status === 'Active' && <CheckCircle2 className="w-4 h-4" />}
          {bot.status}
        </div>
      </div>
    </div>
  );
}