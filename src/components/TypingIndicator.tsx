import React from 'react';
import { Bot } from 'lucide-react';
import { useTranslation } from './TranslationProvider';

interface TypingIndicatorProps {
  visible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ visible }) => {
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <div className="flex items-start gap-3 mb-4 animate-fade-in">
      {/* 头像 */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center">
        <Bot className="w-4 h-4" />
      </div>

      {/* 打字指示器 */}
      <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
        <div className="flex items-center gap-2">
          {/* 动画点 */}
          <div className="flex gap-1">
            <div 
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
              style={{ animationDelay: '0ms', animationDuration: '1.4s' }} 
            />
            <div 
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
              style={{ animationDelay: '200ms', animationDuration: '1.4s' }} 
            />
            <div 
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
              style={{ animationDelay: '400ms', animationDuration: '1.4s' }} 
            />
          </div>
          
          {/* 文字提示 */}
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            {t('research.chatAssistant.thinking') as string}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;