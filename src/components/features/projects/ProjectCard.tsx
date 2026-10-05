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
        <HoverCard className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-2xl-dark theme-transition">
          <div
            className="cursor-pointer flex flex-col h-full"
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
            {/* 顶部图片区域 */}
            <div className="relative overflow-hidden w-full h-44 sm:h-48 bg-gray-100 dark:bg-gray-900">
              <LazyImage
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm ${getStatusColor(
                    project.status
                  )}`}
                >
                  {getStatusText(project.status)}
                </span>
              </div>
            </div>

            {/* 卡片内容区域 */}
            <div className="p-5 sm:p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-1 rounded-md theme-transition">
                  {t(`projects.categories.${project.category}`) as string}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 theme-transition">
                  {project.year}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2.5 theme-transition leading-snug break-words group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {project.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 line-clamp-2 sm:line-clamp-3 theme-transition leading-relaxed break-words flex-1">
                {project.description}
              </p>

              {/* 技术栈标签 */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-gray-100 dark:border-gray-700/60 mt-auto">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded font-mono theme-transition leading-relaxed"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-mono ml-0.5">
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
