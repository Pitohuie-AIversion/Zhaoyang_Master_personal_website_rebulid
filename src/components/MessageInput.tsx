import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useTranslation } from './TranslationProvider';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  isLoading = false,
  placeholder
}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 500;

  const defaultPlaceholder = placeholder || t('research.chatAssistant.placeholder');

  // 自动调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
    }
  };

  const isMessageValid = message.trim().length > 0 && message.length <= maxLength;
  const canSend = isMessageValid && !disabled && !isLoading;

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* 输入框容器 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={defaultPlaceholder}
            disabled={disabled}
            className={`
              w-full px-4 py-3 pr-12
              border border-gray-300 dark:border-gray-600
              rounded-2xl resize-none
              bg-gray-50 dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-colors duration-200
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              min-h-[48px] max-h-[120px]
            `}
            rows={1}
          />
          
          {/* 字符计数 */}
          <div className={`
            absolute bottom-2 right-3 text-xs
            ${message.length > maxLength * 0.8 
              ? message.length >= maxLength 
                ? 'text-red-500' 
                : 'text-yellow-500'
              : 'text-gray-400'
            }
          `}>
            {message.length}/{maxLength}
          </div>
        </div>

        {/* 发送按钮 */}
        <button
          type="submit"
          disabled={!canSend}
          className={`
            flex-shrink-0 w-12 h-12 rounded-full
            flex items-center justify-center
            transition-all duration-200
            ${canSend
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }
          `}
          title={t('research.chatAssistant.send')}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* 错误提示 */}
      {message.length >= maxLength && (
        <div className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <span>⚠️</span>
          <span>{t('research.chatAssistant.maxLength')}</span>
        </div>
      )}

      {/* 提示文本 */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        按 Enter 发送，Shift + Enter 换行
      </div>
    </div>
  );
};

export default MessageInput;