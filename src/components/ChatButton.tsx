import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useTranslation } from './TranslationProvider';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnread?: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({ isOpen, onClick, hasUnread = false }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-gradient-to-r from-blue-600 to-blue-700
        hover:from-blue-700 hover:to-blue-800
        text-white shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        transform hover:scale-110 active:scale-95
        flex items-center justify-center
        group
        ${isOpen ? 'rotate-180' : 'rotate-0'}
      `}
      aria-label={isOpen ? t('research.chatAssistant.close') : t('research.chatAssistant.title')}
        title={isOpen ? t('research.chatAssistant.close') as string : t('research.chatAssistant.title') as string}
    >
      {/* 未读消息指示器 */}
      {hasUnread && !isOpen && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}
      
      {/* 图标 */}
      <div className="relative">
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
        )}
      </div>
      
      {/* 悬停提示 */}
      <div className={`
        absolute right-full mr-3 px-3 py-2
        bg-gray-900 text-white text-sm rounded-lg
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        whitespace-nowrap pointer-events-none
        ${isOpen ? 'hidden' : 'block'}
      `}>
        {t('research.chatAssistant.title') as string}
        <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </button>
  );
};

export default ChatButton;