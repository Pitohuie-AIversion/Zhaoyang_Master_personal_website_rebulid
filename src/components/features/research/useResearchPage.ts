import { useState, useMemo } from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import { getPublications, getPatents, getAwards } from './researchData';
import type { AcademicPublication, AcademicPatent, AcademicAward } from '../../../types';

export const useResearchPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'publications' | 'patents' | 'awards'>('all');
  const [publicationFilter, setPublicationFilter] = useState<'all' | 'published' | 'under_review'>('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AcademicPublication | AcademicPatent | AcademicAward | null>(null);
  const [modalType, setModalType] = useState<'publication' | 'patent' | 'award'>('publication');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 获取翻译后的学术数据 (保留DOI引用以满足系统完整性校验)
  const publications = useMemo<AcademicPublication[]>(() => getPublications(t), [t]);
  const patents = useMemo<AcademicPatent[]>(() => getPatents(t), [t]);
  const awards = useMemo<AcademicAward[]>(() => getAwards(t), [t]);

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesSearch =
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.journal.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = publicationFilter === 'all' || pub.status === publicationFilter;
      return matchesSearch && matchesFilter;
    });
  }, [publications, searchTerm, publicationFilter]);

  const filteredPatents = useMemo(() => {
    return patents.filter(
      (patent) =>
        patent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patent.number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patents, searchTerm]);

  const filteredAwards = useMemo(() => {
    return awards.filter(
      (award) =>
        award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        award.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        award.organization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [awards, searchTerm]);

  const openDetailModal = (
    item: AcademicPublication | AcademicPatent | AcademicAward,
    type: 'publication' | 'patent' | 'award'
  ) => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return {
    t,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    publicationFilter,
    setPublicationFilter,
    showAnalytics,
    setShowAnalytics,
    selectedItem,
    modalType,
    isModalOpen,
    publications,
    patents,
    awards,
    filteredPublications,
    filteredPatents,
    filteredAwards,
    openDetailModal,
    closeDetailModal,
  };
};
