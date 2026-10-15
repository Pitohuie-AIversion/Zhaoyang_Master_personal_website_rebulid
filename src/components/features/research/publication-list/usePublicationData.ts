import { useState, useEffect, useMemo } from 'react';
import { googleScholarService } from '../../../../services/googleScholarService';
import { useTranslation } from '../../../common/TranslationProvider';
import type { PublicationMetrics, SortByOption } from './types';

export const usePublicationData = (externalPapers: PublicationMetrics[] = [], maxItems: number = 10) => {
  const { t } = useTranslation();
  const [papers, setPapers] = useState<PublicationMetrics[]>(externalPapers);
  const [loading, setLoading] = useState(externalPapers.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortByOption>('year');
  const [filterYear, setFilterYear] = useState<string>('all');

  useEffect(() => {
    if (externalPapers.length > 0) {
      setPapers(externalPapers);
      setLoading(false);
      return;
    }

    const fetchPapers = async () => {
      try {
        setLoading(true);
        const data = await googleScholarService.getPublicationMetrics('T3AV5RgAAAAJ');
        setPapers(data);
        setError(null);
      } catch (err) {
        setError(t('academic.papers.error'));
        console.error('Failed to fetch publications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [t, externalPapers]);

  // 排序和筛选逻辑
  const processedPapers = useMemo(() => {
    return papers
      .filter((paper) => filterYear === 'all' || paper.year.toString() === filterYear)
      .sort((a, b) => {
        switch (sortBy) {
          case 'year':
            return b.year - a.year;
          case 'citations':
            return b.citations - a.citations;
          case 'velocity':
            return b.citationVelocity - a.citationVelocity;
          default:
            return 0;
        }
      })
      .slice(0, maxItems);
  }, [papers, filterYear, sortBy, maxItems]);

  // 获取年份选项
  const yearOptions = useMemo(() => {
    return Array.from(new Set(papers.map((p) => p.year.toString()))).sort(
      (a, b) => Number(b) - Number(a)
    );
  }, [papers]);

  return {
    papers,
    processedPapers,
    loading,
    error,
    sortBy,
    setSortBy,
    filterYear,
    setFilterYear,
    yearOptions,
    t,
  };
};
