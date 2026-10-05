import React, { useEffect } from 'react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { ExternalLink, Github, X } from 'lucide-react';
import { UnifiedButton } from '../../common/UnifiedButton';
import LazyImage from '../../common/LazyImage';
import { useTranslation } from '../../common/TranslationProvider';
import { Project } from '../../../types';

export interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <SimpleMotion
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <SimpleMotion
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 theme-transition"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
      >
        <div className="relative">
          <LazyImage
            src={project.image}
            alt={project.title}
            className="w-full h-48 sm:h-56 md:h-72 object-cover"
            placeholder="blur"
          />
          <UnifiedButton
            onClick={onClose}
            variant="ghost"
            size="sm"
            icon={<X className="w-4 h-4 sm:w-5 sm:h-5" />}
            ariaLabel={t('common.close') as string}
            className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 hover:bg-opacity-100 dark:hover:bg-opacity-100"
          />
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 px-2 sm:px-3 py-1 rounded theme-transition">
                {t(`projects.categories.${project.category}`) as string}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 theme-transition">
                {project.year}
              </span>
            </div>
            <div className="flex gap-3">
              {project.githubUrl && (
                <UnifiedButton
                  as="a"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="sm"
                  icon={<Github className="w-3 h-3 sm:w-4 sm:h-4" />}
                  iconPosition="left"
                  className="bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600"
                >
                  {t('projects.code') as string}
                </UnifiedButton>
              )}
              {project.demoUrl && (
                <UnifiedButton
                  as="a"
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="sm"
                  icon={<ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />}
                  iconPosition="left"
                >
                  {t('projects.demo') as string}
                </UnifiedButton>
              )}
            </div>
          </div>
          <h2
            id="project-dialog-title"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 theme-transition leading-tight"
          >
            {project.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-5 theme-transition leading-relaxed">
            {project.description}
          </p>

          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 theme-transition leading-snug">
              {t('projects.highlights') as string}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {project.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0 theme-transition"></div>
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 theme-transition leading-relaxed">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 theme-transition leading-snug">
              {t('projects.techStack') as string}
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm theme-transition"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SimpleMotion>
    </SimpleMotion>
  );
};

export default ProjectDetailModal;
