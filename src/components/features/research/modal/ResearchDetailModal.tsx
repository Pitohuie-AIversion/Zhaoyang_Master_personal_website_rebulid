import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { UnifiedButton } from '../../../common/UnifiedButton';
import { useTranslation } from '../../../common/TranslationProvider';
import { ResearchDetailModalProps, Publication, Patent, Award } from './types';
import { PublicationDetailView } from './PublicationDetailView';
import { PatentDetailView } from './PatentDetailView';
import { AwardDetailView } from './AwardDetailView';

export const ResearchDetailModal: React.FC<ResearchDetailModalProps> = ({
  item,
  type,
  isOpen,
  onClose
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { t } = useTranslation();

  if (!item) return null;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {type === 'publication' ? t('publications.modal.publicationDetail') as string : 
                 type === 'patent' ? t('publications.modal.patentDetail') as string : t('publications.modal.awardDetail') as string}
              </h1>
              <UnifiedButton
                onClick={onClose}
                variant="ghost"
                size="sm"
                icon={<X className="w-5 h-5" />}
              />
            </div>

            <div className="p-6">
              {type === 'publication' && (
                <PublicationDetailView
                  pub={item as Publication}
                  copiedField={copiedField}
                  onCopy={copyToClipboard}
                />
              )}
              {type === 'patent' && (
                <PatentDetailView
                  patent={item as Patent}
                  copiedField={copiedField}
                  onCopy={copyToClipboard}
                />
              )}
              {type === 'award' && (
                <AwardDetailView
                  award={item as Award}
                  copiedField={copiedField}
                  onCopy={copyToClipboard}
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
