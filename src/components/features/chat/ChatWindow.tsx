import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import QuickReplies from './QuickReplies';
import TypingIndicator from './TypingIndicator';
import { ChatHeader, useChatMessages, type ChatWindowProps } from './chat-window';

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose, onSendMessage }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const {
    messages,
    isLoading,
    showQuickReplies,
    messagesEndRef,
    messagesContainerRef,
    handleSendMessage,
    handleQuickReply,
    handleClearHistory,
  } = useChatMessages({ isOpen, onSendMessage });

  if (!isOpen) return null;

  return (
    <div
      className={`
      fixed bottom-6 right-6 z-40
      w-96 bg-white dark:bg-gray-900
      rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700
      transition-all duration-300 ease-in-out
      ${isMinimized ? 'h-16' : 'h-[600px]'}
      flex flex-col overflow-hidden
    `}
    >
      <ChatHeader
        isMinimized={isMinimized}
        onToggleMinimize={() => setIsMinimized((prev) => !prev)}
        onClearHistory={handleClearHistory}
        onClose={onClose}
      />

      {/* 内容区域 */}
      {!isMinimized && (
        <>
          {/* 快速回复 */}
          {showQuickReplies && messages.length <= 1 && (
            <QuickReplies onQuickReply={handleQuickReply} disabled={isLoading} />
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
