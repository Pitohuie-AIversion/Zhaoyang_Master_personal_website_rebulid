import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Maximize2, RotateCcw, Globe } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import QuickReplies from './QuickReplies';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedLinks?: Array<{
    title: string;
    url: string;
  }>;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => Promise<{
    reply: string;
    relatedLinks?: Array<{ title: string; url: string }>;
  }>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose, onSendMessage }) => {
  const { t, language, setLanguage } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 初始化欢迎消息
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: t('research.chatAssistant.welcomeMessage') as string,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, t, messages.length]);

  // 自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // 语言切换时更新欢迎消息
  useEffect(() => {
    if (messages.length > 0 && messages[0].id === 'welcome') {
      setMessages(prev => [
        {
          ...prev[0],
          content: t('research.chatAssistant.welcomeMessage') as string
        },
        ...prev.slice(1)
      ]);
    }
  }, [language, t]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // 添加用户消息
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setShowQuickReplies(false);

    try {
      // 调用API获取回复
      const response = await onSendMessage(content);
      
      // 添加助手回复
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response.reply,
        timestamp: new Date(),
        relatedLinks: response.relatedLinks
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // 添加错误消息
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: t('research.chatAssistant.errorMessage') as string,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (message: string) => {
    handleSendMessage(message);
  };

  const handleClearHistory = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'assistant',
      content: t('research.chatAssistant.welcomeMessage') as string,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    setShowQuickReplies(true);
  };

  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
  };

  if (!isOpen) return null;

  return (
    <div className={`
      fixed bottom-6 right-6 z-40
      w-96 bg-white dark:bg-gray-900
      rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700
      transition-all duration-300 ease-in-out
      ${isMinimized ? 'h-16' : 'h-[600px]'}
      flex flex-col overflow-hidden
    `}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">{t('research.chatAssistant.aiLabel', { fallback: 'AI' }) as string}</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t('research.chatAssistant.title') as string}</h3>
            <p className="text-xs opacity-80">{t('research.chatAssistant.subtitle') as string}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* 语言切换 */}
          <button
            onClick={toggleLanguage}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
            title={t('research.chatAssistant.language.switch') as string}
          >
            <Globe className="w-4 h-4" />
          </button>
          
          {/* 清空历史 */}
          <button
            onClick={handleClearHistory}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
            title={t('research.chatAssistant.clearHistory') as string}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          {/* 最小化 */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
            title={isMinimized ? t('research.chatAssistant.maximize') as string : t('research.chatAssistant.minimize') as string}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          
          {/* 关闭 */}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
            title={t('research.chatAssistant.close') as string}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      {!isMinimized && (
        <>
          {/* 快速回复 */}
          {showQuickReplies && messages.length <= 1 && (
            <QuickReplies 
              onQuickReply={handleQuickReply}
              disabled={isLoading}
            />
          )}

          {/* 消息列表 */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800"
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {/* 打字指示器 */}
            <TypingIndicator visible={isLoading} />
            
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default ChatWindow;
