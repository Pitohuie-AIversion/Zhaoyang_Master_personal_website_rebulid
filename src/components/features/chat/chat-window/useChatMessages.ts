import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../../common/TranslationProvider';
import type { Message } from './types';

interface UseChatMessagesOptions {
  isOpen: boolean;
  onSendMessage: (message: string) => Promise<{
    reply: string;
    relatedLinks?: Array<{ title: string; url: string }>;
  }>;
}

export const useChatMessages = ({ isOpen, onSendMessage }: UseChatMessagesOptions) => {
  const { t, language, setLanguage } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
        timestamp: new Date(),
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
      setMessages((prev) => [
        {
          ...prev[0],
          content: t('research.chatAssistant.welcomeMessage') as string,
        },
        ...prev.slice(1),
      ]);
    }
  }, [language, t, messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // 添加用户消息
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
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
        relatedLinks: response.relatedLinks,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);

      // 添加错误消息
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: t('research.chatAssistant.errorMessage') as string,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
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
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setShowQuickReplies(true);
  };

  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
  };

  return {
    messages,
    isLoading,
    showQuickReplies,
    messagesEndRef,
    messagesContainerRef,
    handleSendMessage,
    handleQuickReply,
    handleClearHistory,
    toggleLanguage,
    t,
  };
};
