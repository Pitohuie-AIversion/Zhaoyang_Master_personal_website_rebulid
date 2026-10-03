import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import { useAdvancedSearch } from '../search/SearchAndFilter';
import type { PublicationItem } from '../../../types';
import { getPublicationsList, PUBLICATION_TYPES } from './publicationsData';

export const usePublicationSearch = () => {
  const { t } = useTranslation();
  const [selectedPublication, setSelectedPublication] = useState<PublicationItem | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  const handleCopyCitation = useCallback((pub: PublicationItem) => {
    const citationText = `${pub.authors} (${pub.year}). ${pub.title}. ${pub.journal}${
      pub.doi ? `. https://doi.org/${pub.doi}` : ''
    }`;
    navigator.clipboard.writeText(citationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  }, []);

  const publications: PublicationItem[] = useMemo(
    () => getPublicationsList(t),
    [t]
  );

  const typeLabels = useMemo(
    () => ({
      全部: t('publications.filters.all') as string,
      journal: t('publications.types.journal') as string,
      conference: t('publications.types.conference') as string,
      patent: t('publications.types.patent') as string,
    }),
    [t]
  );

  const hasCitationData = useMemo(
    () => publications.some((publication) => publication.citations !== undefined),
    [publications]
  );

  useEffect(() => {
    if (!selectedPublication) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedPublication(null);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [selectedPublication]);

  // 使用高级搜索Hook
  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    removeFilter,
    clearAllFilters,
    sortBy,
    setSortBy,
    filteredData: filteredPublications,
    totalCount,
    filteredCount,
  } = useAdvancedSearch({
    data: publications,
    searchFields: ['title', 'authors', 'journal', 'abstract', 'keywords', 'doi'],
    filterFields: {
      type: (item: PublicationItem) => item.type,
      status: (item: PublicationItem) => item.status,
      year: (item: PublicationItem) => item.year,
    },
    sortFields: {
      year: (item: PublicationItem) => parseInt(item.year) || 0,
      title: (item: PublicationItem) => item.title,
      citations: (item: PublicationItem) => item.citations || 0,
    },
    searchFieldMappers: {
      type: (item: PublicationItem) => {
        const typeLabel = typeLabels[item.type as keyof typeof typeLabels];
        return typeLabel ? [typeLabel] : [];
      },
    },
  });

  const filterOptions = useMemo(
    () => ({
      type: PUBLICATION_TYPES.slice(1).map((type) => ({
        value: type,
        label: typeLabels[type as keyof typeof typeLabels] || type,
      })),
      status: [
        { value: 'published', label: t('publications.status.published') as string },
        { value: 'under_review', label: t('publications.status.underReview') as string },
        { value: 'in_preparation', label: t('publications.status.inPreparation') as string },
      ],
      year: Array.from(new Set(publications.map((p) => p.year)))
        .sort((a, b) => parseInt(b) - parseInt(a))
        .map((year) => ({ value: year, label: year })),
    }),
    [publications, t, typeLabels]
  );

  const sortOptions = useMemo(
    () => [
      { value: 'year', label: t('publications.sort.year') as string, direction: 'desc' as const },
      { value: 'title', label: t('publications.sort.title') as string, direction: 'asc' as const },
      ...(hasCitationData
        ? [
            {
              value: 'citations',
              label: t('publications.sort.citations') as string,
              direction: 'desc' as const,
            },
          ]
        : []),
    ],
    [hasCitationData, t]
  );

  return {
    t,
    typeLabels,
    selectedPublication,
    setSelectedPublication,
    copiedCitation,
    handleCopyCitation,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    removeFilter,
    clearAllFilters,
    sortBy,
    setSortBy,
    filteredPublications,
    totalCount,
    filteredCount,
    filterOptions,
    sortOptions,
  };
};
