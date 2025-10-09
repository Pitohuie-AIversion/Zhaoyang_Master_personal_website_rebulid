import React from 'react';
import { useTranslation } from './TranslationProvider';
import { 
  BookOpen, 
  Briefcase, 
  Mail, 
  GraduationCap, 
  Code, 
  FileText, 
  Award 
} from 'lucide-react';

interface QuickRepliesProps {
  onQuickReply: (message: string) => void;
  disabled?: boolean;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ onQuickReply, disabled = false }) => {
  const { t } = useTranslation();

  const quickReplies = [
    {
      key: 'research',
      icon: BookOpen,
      message: '请介绍一下牟昭阳的研究方向和学术背景'
    },
    {
      key: 'projects',
      icon: Briefcase,
      message: '能详细介绍一下他的项目经验吗？'
    },
    {
      key: 'education',
      icon: GraduationCap,
      message: '他的教育背景是怎样的？'
    },
    {
      key: 'skills',
      icon: Code,
      message: '他掌握哪些技能和工具？'
    },
    {
      key: 'publications',
      icon: FileText,
      message: '有哪些学术论文和研究成果？'
    },
    {
      key: 'patents',
      icon: Award,
      message: '他有哪些专利成果？'
    },
    {
      key: 'contact',
      icon: Mail,
      message: '如何联系牟昭阳？'
    }
  ];

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('research.chatAssistant.quickRepliesTitle')}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t('research.chatAssistant.quickRepliesDescription')}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {quickReplies.map((reply) => {
          const Icon = reply.icon;
          return (
            <button
              key={reply.key}
              onClick={() => onQuickReply(reply.message)}
              disabled={disabled}
              className={`
                flex items-center gap-2 p-3 rounded-lg text-left
                transition-all duration-200
                ${disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700'
                }
                bg-white dark:bg-gray-700
                border border-gray-200 dark:border-gray-600
                text-gray-700 dark:text-gray-300
                hover:shadow-sm
                group
              `}
            >
              <Icon className={`
                w-4 h-4 flex-shrink-0
                ${disabled 
                  ? 'text-gray-400' 
                  : 'text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300'
                }
                transition-colors duration-200
              `} />
              <span className="text-sm font-medium">
                {t(`research.chatAssistant.quickReplies.${reply.key}`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickReplies;