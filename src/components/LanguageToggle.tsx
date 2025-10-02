import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Languages } from 'lucide-react';
import { useTranslation } from './TranslationProvider';

interface LanguageToggleProps {
  variant?: 'default' | 'compact' | 'minimal';
  showText?: boolean;
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  variant = 'default',
  showText = true,
  className = ''
}) => {
  const { language, toggleLanguage, isTranslating } = useTranslation();

  const handleToggle = () => {
    if (isTranslating) return;
    toggleLanguage();
  };

  const variants = {
    default: {
      button: 'px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300',
      icon: 'w-5 h-5',
      text: 'ml-2 text-sm font-medium'
    },
    compact: {
      button: 'p-2 w-10 h-10 rounded-lg bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300/80 dark:hover:bg-gray-600/80 backdrop-blur-sm border border-gray-300/20 dark:border-gray-600/20 transition-all duration-300',
      icon: 'w-4 h-4',
      text: 'ml-1 text-xs'
    },
    minimal: {
      button: 'p-1 rounded hover:bg-white/10 transition-all duration-300',
      icon: 'w-4 h-4',
      text: 'ml-1 text-xs'
    }
  };

  const currentVariant = variants[variant];

  return (
    <motion.button
      onClick={handleToggle}
      disabled={isTranslating}
      className={`
        ${currentVariant.button}
        ${className}
        flex items-center justify-center
        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`切换到${language === 'zh' ? '英文' : '中文'}`}
    >
      {/* 背景动画 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* 加载动画 */}
      {isTranslating && (
        <motion.div
          className="absolute inset-0 bg-blue-500/30 rounded-lg"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      
      <div className="relative flex items-center">
        {/* 图标动画 */}
        <motion.div
          animate={isTranslating ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 1, repeat: isTranslating ? Infinity : 0, ease: "linear" }}
        >
          {variant === 'minimal' ? (
            <Languages className={currentVariant.icon} />
          ) : (
            <Globe className={currentVariant.icon} />
          )}
        </motion.div>
        
        {/* 语言文本 */}
        {showText && (
          <motion.span
            className={currentVariant.text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {language === 'zh' ? 'EN' : '中'}
          </motion.span>
        )}
        
        {/* 切换指示器 */}
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: language === 'en' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.button>
  );
};

// 语言选择器下拉菜单组件
export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage, isTranslating } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const languages = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className="
          px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm
          border border-white/20 transition-all duration-300
          flex items-center space-x-2 text-white/90 hover:text-white
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">
          {languages.find(lang => lang.code === language)?.flag}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      {/* 下拉菜单 */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : -10,
          scale: isOpen ? 1 : 0.95
        }}
        transition={{ duration: 0.2 }}
        className={`
          absolute top-full mt-2 right-0 z-50
          bg-gray-900/95 backdrop-blur-sm rounded-lg border border-white/20
          shadow-xl overflow-hidden
          ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
      >
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code as 'zh' | 'en');
              setIsOpen(false);
            }}
            className={`
              w-full px-4 py-3 text-left flex items-center space-x-3
              hover:bg-white/10 transition-colors duration-200
              ${language === lang.code ? 'bg-blue-500/20 text-blue-300' : 'text-white/80'}
            `}
            whileHover={{ x: 4 }}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="text-sm font-medium">{lang.name}</span>
            {language === lang.code && (
              <motion.div
                className="ml-auto w-2 h-2 bg-blue-400 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* 点击外部关闭 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageToggle;