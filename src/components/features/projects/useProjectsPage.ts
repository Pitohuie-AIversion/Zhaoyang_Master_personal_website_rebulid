import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import { useAdvancedSearch } from '../search/SearchAndFilter';
import type { Project } from '../../../types';
import {
  getProjects,
  getCategories,
  getYearOptions,
  getStatusText,
} from './projectsData';

export const useProjectsPage = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { t } = useTranslation();

  // 模态弹窗与滚动锁定
  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProject(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

  const categories = useMemo(
    () =>
      getCategories(
        t as (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string
      ),
    [t]
  );

  const yearOptions = useMemo(
    () =>
      getYearOptions(
        t as (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string
      ),
    [t]
  );

  const projects = useMemo(
    () =>
      getProjects(
        t as (key: string, options?: { returnObjects?: boolean; fallback?: string }) => string
      ),
    [t]
  );

  // 高级搜索与筛选 Hook
  const {
    searchTerm,
    setSearchTerm,
    filters,
    sortBy,
    setSortBy,
    filteredData: filteredProjects,
    updateFilter,
    removeFilter,
    totalCount,
    filteredCount,
  } = useAdvancedSearch({
    data: projects,
    searchFields: ['title', 'description', 'technologies', 'category'],
    filterFields: {
      category: (item: Project) => item.category,
      status: (item: Project) => item.status,
      year: (item: Project) => item.year,
    },
    sortFields: {
      title: (item: Project) => item.title,
      year: (item: Project) => item.year,
      category: (item: Project) => item.category,
      status: (item: Project) => item.status,
    },
    searchFieldMappers: {
      category: (item: Project) => {
        const categoryOption = categories.find((cat) => cat.value === item.category);
        return categoryOption ? [categoryOption.label] : [];
      },
    },
  });

  const filterOptions = {
    category: categories.slice(1),
    status: [
      { value: 'completed', label: getStatusText('completed', t as (key: string) => string) },
      { value: 'ongoing', label: getStatusText('ongoing', t as (key: string) => string) },
      { value: 'planned', label: getStatusText('planned', t as (key: string) => string) },
    ],
    year: yearOptions.slice(1).map((year) => ({ value: year, label: year })),
  };

  const sortOptions = [
    { value: 'title', label: t('projects.sort.title') as string, direction: 'asc' as const },
    { value: 'year', label: t('projects.sort.year') as string, direction: 'desc' as const },
    { value: 'category', label: t('projects.sort.category') as string, direction: 'asc' as const },
    { value: 'status', label: t('projects.sort.status') as string, direction: 'asc' as const },
  ];

  return {
    t,
    categories,
    yearOptions,
    filterOptions,
    sortOptions,
    searchTerm,
    setSearchTerm,
    filters,
    sortBy,
    setSortBy,
    filteredProjects,
    updateFilter,
    removeFilter,
    totalCount,
    filteredCount,
    selectedProject,
    setSelectedProject,
  };
};
