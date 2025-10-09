import React from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useTranslation } from './TranslationProvider';

interface MessageBubbleProps {
  message: {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    relatedLinks?: Array<{
      title: string;
      url: string;
    }>;
  };
  isTyping?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isTyping = false }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState(false);

  const isUser = message.type === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex items-start gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* 头像 */}
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${isUser 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
        }
      `}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* 消息内容 */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        {/* 消息气泡 */}
        <div className={`
          relative px-4 py-3 rounded-2xl
          ${isUser 
            ? 'bg-blue-600 text-white ml-auto' 
            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
          }
          ${isUser ? 'rounded-br-md' : 'rounded-bl-md'}
          group
        `}>
          {/* 打字动画 */}
          {isTyping && !isUser && (
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-gray-500 ml-2">{t('research.chatAssistant.thinking')}</span>
            </div>
          )}

          {/* 消息文本 */}
          {!isTyping && (
            <>
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>

              {/* 相关链接 */}
              {message.relatedLinks && message.relatedLinks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-sm font-medium mb-2 opacity-80">相关链接：</div>
                  <div className="flex flex-wrap gap-2">
                    {message.relatedLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        className={`
                          inline-flex items-center px-3 py-1 rounded-full text-xs
                          ${isUser 
                            ? 'bg-blue-500 hover:bg-blue-400 text-white' 
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
                          }
                          transition-colors duration-200
                        `}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 复制按钮 */}
              {!isUser && (
                <button
                  onClick={handleCopy}
                  className={`
                    absolute top-2 right-2 p-1 rounded
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                    hover:bg-gray-200 dark:hover:bg-gray-700
                  `}
                  title="复制消息"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500" />
                  )}
                </button>
              )}
            </>
          )}
        </div>

        {/* 时间戳 */}
        {!isTyping && (
          <div className={`
            text-xs text-gray-500 mt-1 px-1
            ${isUser ? 'text-right' : 'text-left'}
          `}>
            {formatTime(message.timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;