import React from 'react';
import { ProjectCardSkeleton, LazyWrapper } from '../../common/LoadingComponents';
import LazyImage from '../../common/LazyImage';
import { ScrollReveal, HoverCard } from '../../animations/InteractiveEffects';
import { useTranslation } from '../../common/TranslationProvider';
import { Project } from '../../../types';

export interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  onClick,
  getStatusColor,
  getStatusText,
}) => {
  const { t } = useTranslation();

  return (
    <LazyWrapper fallback={<ProjectCardSkeleton />}>
      <ScrollReveal direction="up" delay={index * 0.1}>
        <HoverCard className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden theme-transition">
          <div
            className="cursor-pointer p-4 sm:p-6"
            onClick={onClick}
            role="button"
            tabIndex={0}
            aria-label={project.title}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
              }
            }}
          >
            <div className="relative">
              <LazyImage
                src={project.image}
                alt={project.title}
                className="w-full h-32 sm:h-40 object-cover"
              />
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                    project.status
                  )}`}
                >
                  {getStatusText(project.status)}
                </span>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded theme-transition">
                  {t(`projects.categories.${project.category}`) as string}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 theme-transition">
                  {project.year}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 theme-transition leading-snug break-words">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 sm:line-clamp-3 theme-transition leading-loose break-words hyphens-auto">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded theme-transition leading-relaxed"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 theme-transition">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </HoverCard>
      </ScrollReveal>
    </LazyWrapper>
  );
};

export default ProjectCard;
