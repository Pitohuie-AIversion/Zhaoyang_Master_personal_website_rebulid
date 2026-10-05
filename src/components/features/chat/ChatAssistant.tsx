import React, { useState, useCallback } from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';

interface ChatAssistantProps {
  className?: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ className = '' }) => {
  const { language, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const handleToggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setHasUnread(false);
    }
  }, [isOpen]);

  const handleCloseChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 离线回复逻辑（当API不可用时）
  const getOfflineReply = useCallback((message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('研究') || lowerMessage.includes('research')) {
      return t('common.chat.researchIntro') as string;
    }

    if (lowerMessage.includes('项目') || lowerMessage.includes('project')) {
      return t('common.chat.projectsIntro') as string;
    }

    if (lowerMessage.includes('教育') || lowerMessage.includes('education')) {
      return t('common.chat.educationIntro') as string;
    }

    if (lowerMessage.includes('联系') || lowerMessage.includes('contact')) {
      return t('common.chat.contactIntro') as string;
    }

    if (lowerMessage.includes('技能') || lowerMessage.includes('skill')) {
      return t('common.chat.skillsIntro') as string;
    }

    return t('common.chat.defaultHelp') as string;
  }, [t]);

  // 获取相关链接
  const getRelatedLinks = useCallback((message: string) => {
    const lowerMessage = message.toLowerCase();
    const links = [];

    if (lowerMessage.includes('研究') || lowerMessage.includes('research')) {
      links.push({ title: t('navigation.research') as string, url: '/research' });
    }

    if (lowerMessage.includes('项目') || lowerMessage.includes('project')) {
      links.push({ title: t('navigation.projects') as string, url: '/projects' });
    }

    if (lowerMessage.includes('论文') || lowerMessage.includes('publication')) {
      links.push({ title: t('navigation.publications') as string, url: '/publications' });
    }

    if (lowerMessage.includes('联系') || lowerMessage.includes('contact')) {
      links.push({ title: t('navigation.contact') as string, url: '/contact' });
    }

    if (lowerMessage.includes('技能') || lowerMessage.includes('skill')) {
      links.push({ title: t('navigation.skills') as string, url: '/skills' });
    }

    return links;
  }, [t]);

  // 模拟发送消息到后端API
  const handleSendMessage = useCallback(async (message: string) => {
    try {
      // 生成会话ID（如果没有的话）
      let sessionId = localStorage.getItem('chat_session_id');
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chat_session_id', sessionId);
      }

      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId,
          language: language,
          context: [] // 可以添加上下文消息历史
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        reply: data.response || data.reply,
        relatedLinks: data.relatedLinks || []
      };
    } catch (error) {
      console.error('Failed to send message:', error);

      // 返回错误消息或离线回复
      return {
        reply: getOfflineReply(message),
        relatedLinks: getRelatedLinks(message)
      };
    }
  }, [language, getOfflineReply, getRelatedLinks]);

  return (
    <div className={`chat-assistant ${className}`}>
      <ChatButton
        isOpen={isOpen}
        onClick={handleToggleChat}
        hasUnread={hasUnread}
      />

      <ChatWindow
        isOpen={isOpen}
        onClose={handleCloseChat}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatAssistant;
