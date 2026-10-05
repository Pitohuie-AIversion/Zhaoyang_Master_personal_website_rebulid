import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from '../TranslationProvider';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
  }>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, items }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm z-[90] lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            id="mobile-navigation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.25 }}
            className="fixed top-0 right-0 h-dvh w-80 max-w-[88vw] bg-white dark:bg-gray-950 shadow-2xl z-[100] lg:hidden overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={t('common.menu')}
          >
            <div className="p-6 h-full flex flex-col">
              {/* 关闭按钮 */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={onClose}
                  className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label={t('common.close')}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 导航菜单 */}
              <div className="flex-1">
                <nav className="space-y-3">
                  {items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={item.name}
                        whileHover={{ x: 6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to={item.href}
                          onClick={onClose}
                          aria-current={item.isActive ? 'page' : undefined}
                          className={`flex items-center space-x-4 px-5 py-4 rounded-xl text-base font-medium transition-all duration-200 break-words ${
                            item.isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm'
                          }`}
                        >
                          <IconComponent className="w-6 h-6 flex-shrink-0" />
                          <span className="leading-relaxed">{item.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* 底部装饰 */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <img src="/favicon.svg" alt={t('common.logoAlt') as string} className="w-full h-full object-contain" />
                  </div>
                  <p className="leading-relaxed">{t('home.hero.name') as string}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
