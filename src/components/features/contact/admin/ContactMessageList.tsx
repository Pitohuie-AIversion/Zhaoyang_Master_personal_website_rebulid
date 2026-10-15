import React from 'react';
import { useTranslation } from '../../../common/TranslationProvider';
import type { ContactMessage } from '../../../../types';

interface ContactMessageListProps {
  messages: ContactMessage[];
  selectedMessageId?: string;
  onSelectMessage: (message: ContactMessage) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string, t?: (key: string) => string) => string;
}

export const ContactMessageList: React.FC<ContactMessageListProps> = ({
  messages,
  selectedMessageId,
  onSelectMessage,
  getStatusColor,
  getStatusLabel
}) => {
  const { t, language } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('contact.admin.list.title') as string} ({messages.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
              selectedMessageId === message.id
                ? 'bg-blue-50 dark:bg-blue-900/30 border-r-2 border-blue-500'
                : ''
            }`}
            onClick={() => onSelectMessage(message)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {message.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(message.status)}`}>
                    {getStatusLabel(message.status, t)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{message.email}</p>
                <p className="text-sm text-gray-900 dark:text-gray-200 font-medium mt-1 truncate">
                  {message.subject}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {message.message.substring(0, 100)}...
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {new Date(message.created_at).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}
                </p>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <p>{t('contact.admin.list.noMessages') as string}</p>
          </div>
        )}
      </div>
    </div>
  );
};

