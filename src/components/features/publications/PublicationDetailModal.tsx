import React from 'react';
import { createPortal } from 'react-dom';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { useTranslation } from '../../common/TranslationProvider';
import { PublicationItem } from '../../../types';

export interface PublicationDetailModalProps {
  publication: PublicationItem | null;
  onClose: () => void;
  getTypeIcon: (type: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  typeLabels: Record<string, string>;
  copiedCitation: boolean;
  onCopyCitation: (pub: PublicationItem) => void;
}

export const PublicationDetailModal: React.FC<PublicationDetailModalProps> = ({
  publication,
  onClose,
  getTypeIcon,
  getStatusColor,
  getStatusText,
  typeLabels,
  copiedCitation,
  onCopyCitation,
}) => {
  const { t } = useTranslation();

  if (!publication) return null;

  return createPortal(
    <SimpleMotion
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <SimpleMotion
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        ariaModal
        ariaLabelledby="publication-dialog-title"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-blue-600 dark:text-blue-400">
                {getTypeIcon(publication.type)}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-md">
                {typeLabels[publication.type] || publication.type}
              </span>
              <span
                className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(
                  publication.status
                )}`}
              >
                {getStatusText(publication.status)}
              </span>
            </div>
            <button
              type="button"
              autoFocus
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={t('common.close') as string}
            >
              ×
            </button>
          </div>

          <h2
            id="publication-dialog-title"
            className="text-xl font-bold text-gray-900 dark:text-white mb-3"
          >
            {publication.title}
          </h2>
          {publication.authors && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>{t('publications.modal.authors') as string}:</strong>{' '}
              {publication.authors}
            </p>
          )}
          <p className="text-sm text-gray-900 dark:text-gray-100 font-medium mb-2">
            {publication.journal}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            <strong>{t('publications.modal.year') as string}:</strong> {publication.year}
          </p>

          {publication.doi && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              <strong>{t('publications.modal.doi') as string}:</strong>{' '}
              <span className="font-mono text-xs">{publication.doi}</span>
            </p>
          )}
          {publication.url && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              <strong>{t('publications.modal.publisherLink') as string}:</strong>{' '}
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline break-all"
              >
                {publication.url}
              </a>
            </p>
          )}

          {publication.citations !== undefined && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              <strong>{t('publications.modal.citationsCount') as string}:</strong>{' '}
              {publication.citations}
            </p>
          )}

          {publication.abstract && (
            <div className="mb-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                {t('publications.modal.abstract') as string}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {publication.abstract}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              {t('publications.modal.keywords') as string}
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(publication.keywords) &&
                publication.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm"
                  >
                    {keyword}
                  </span>
                ))}
            </div>
          </div>

          {/* 快捷操作栏 */}
          <div className="flex flex-wrap items-center gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onCopyCitation(publication)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              {copiedCitation
                ? (t('publications.modal.citationCopied') as string)
                : (t('publications.modal.copyCitation') as string)}
            </button>

            {publication.url && (
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                {t('publications.modal.publisherLink') as string}
              </a>
            )}
          </div>
        </div>
      </SimpleMotion>
    </SimpleMotion>,
    document.body
  );
};

export default PublicationDetailModal;
