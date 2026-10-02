import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../TranslationProvider';

export const PageLoader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text-center">
        {/* 主加载动画 */}
        <motion.div
          className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />

        {/* 加载文本 */}
        <motion.p
          className="text-gray-600 text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t('common.loading') as string}
        </motion.p>

        {/* 进度条 */}
        <motion.div
          className="w-48 h-1 bg-gray-200 rounded-full mt-4 mx-auto overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full bg-gray-900 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </div>
  );
};
