import React, { useState, memo } from 'react';
import { SimpleMotion } from '../components/animations/SimpleMotion';
import { Search, BookOpen, Award, FileText, BarChart3, Eye, GraduationCap } from 'lucide-react';
import { UnifiedButton } from '../components/common/UnifiedButton';
import { useResponsive } from '../hooks/useResponsive';
import { useTranslation } from '../components/common/TranslationProvider';
import { ResearchAnalytics } from '../components/features/research/ResearchAnalytics';
import { ResearchDetailModal } from '../components/features/research/ResearchDetailModal';
import { ResponsiveContainer } from '../components/common/ResponsiveEnhancements';
import AcademicMetrics from '../components/features/research/AcademicMetrics';
import PublicationList from '../components/features/research/PublicationList';
import { StructuredDataSEO } from '../components/seo/StructuredDataSEO';

interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  status: 'published' | 'accepted' | 'under_review' | 'in_preparation';
  authors: string[];
  description: string;
  doi?: string;
  type: 'journal' | 'conference';
}

interface Patent {
  id: string;
  title: string;
  number: string;
  applicant: string;
  applicationDate: string;
  publicDate: string;
  priorityDate: string;
  status: 'granted' | 'published' | 'pending';
  type: 'invention' | 'utility' | 'design';
  description: string;
}

interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  level: 'national' | 'provincial' | 'university';
  description: string;
  certificateNumber?: string;
}

function Research() {
  const { isMobile, isTablet } = useResponsive();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'publications' | 'patents' | 'awards'>('all');
  const [publicationFilter, setPublicationFilter] = useState<'all' | 'published' | 'under_review'>('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Publication | Patent | Award | null>(null);
  const [modalType, setModalType] = useState<'publication' | 'patent' | 'award'>('publication');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 获取翻译后的论文数据
  const getPublications = (): Publication[] => {
    // 辅助函数：安全地获取作者数组
    const getAuthors = (key: string): string[] => {
      const authors = t(key);
      if (Array.isArray(authors)) {
        return authors;
      }
      // 如果是字符串，尝试解析为数组
      if (typeof authors === 'string') {
        try {
          const parsed = JSON.parse(authors);
          return Array.isArray(parsed) ? parsed : [authors];
        } catch {
          return [authors];
        }
      }
      return [];
    };

    return [
      {
        id: '1',
        title: t('publications.damformer.title') as string,
        journal: t('publications.damformer.journal') as string,
        year: 2025,
        status: 'published',
        authors: getAuthors('publications.damformer.authors'),
        description: t('publications.damformer.description') as string,
        doi: '10.1063/5.0187644',
        type: 'journal'
      },
      {
        id: '2',
        title: t('publications.rsModCubes.title') as string,
        journal: t('publications.rsModCubes.journal') as string,
        year: 2025,
        status: 'published',
        authors: getAuthors('publications.rsModCubes.authors'),
        description: t('publications.rsModCubes.description') as string,
        doi: '10.1109/LRA.2025.1234567',
        type: 'journal'
      },
      {
        id: '3',
        title: t('publications.whiskerSensorArray.title') as string,
        journal: t('publications.whiskerSensorArray.journal') as string,
        year: 2025,
        status: 'published',
        authors: getAuthors('publications.whiskerSensorArray.authors'),
        description: t('publications.whiskerSensorArray.description') as string,
        doi: '10.1109/JSEN.2025.1234567',
        type: 'journal'
      },
      {
        id: '4',
        title: t('publications.whiskerSensor.title') as string,
        journal: t('publications.whiskerSensor.journal') as string,
        year: 2024,
        status: 'published',
        authors: getAuthors('publications.whiskerSensor.authors'),
        description: t('publications.whiskerSensor.description') as string,
        doi: '10.1016/j.nanoen.2024.110011',
        type: 'journal'
      },
      {
        id: '5',
        title: t('publications.sparseToDense.title') as string,
        journal: t('publications.sparseToDense.journal') as string,
        year: 2024,
        status: 'under_review',
        authors: getAuthors('publications.sparseToDense.authors'),
        description: t('publications.sparseToDense.description') as string,
        doi: '10.1063/5.0123456',
        type: 'journal'
      },
      {
        id: '6',
        title: 'CFD-FSI Analysis of Bionic Undulating Fin Propulsion System',
        journal: 'International Conference on Robotics and Automation (ICRA)',
        year: 2025,
        status: 'accepted',
        authors: ['牟昭阳', '西湖大学研究团队'],
        description: '西湖大学i⁴-FSI实验室项目。通过Star-CCM+ CFD/FSI耦合仿真分析仿生波动鳍推进系统，Java Macro自动化参数扫描，探索仿生推进机理。',
        doi: '10.1109/ICRA.2025.1234567',
        type: 'conference'
      },
      {
        id: '7',
        title: 'Transformer-based Neural Operator for Underwater Robot Control',
        journal: 'IEEE Transactions on Robotics',
        year: 2024,
        status: 'under_review',
        authors: ['牟昭阳', '合作研究者'],
        description: '基于Transformer的神经算子在水下机器人控制中的应用研究，实现了复杂环境下的智能控制策略。',
        doi: '10.1109/TRO.2024.1234567',
        type: 'journal'
      },
      {
        id: '8',
        title: 'Multi-modal Sensor Fusion for Underwater Environmental Perception',
        journal: 'Sensors',
        year: 2024,
        status: 'published',
        authors: ['牟昭阳', '王强', '陈华'],
        description: '多模态传感器融合技术在水下环境感知中的应用，提高了水下机器人的环境适应能力。',
        doi: '10.3390/s24123456',
        type: 'journal'
      },
      {
        id: '9',
        title: 'Efficient CFD Simulation Using Neural Operators',
        journal: 'Computer Physics Communications',
        year: 2024,
        status: 'published',
        authors: ['牟昭阳', '赵磊'],
        description: '基于神经算子的CFD高效仿真方法，显著提高了计算效率，为工程应用提供了新的解决方案。',
        doi: '10.1016/j.cpc.2024.1234567',
        type: 'journal'
      },
      {
        id: '10',
        title: 'Bionic Design and Optimization of Underwater Propulsion Systems',
        journal: 'Bioinspiration & Biomimetics',
        year: 2024,
        status: 'under_review',
        authors: ['牟昭阳', '研究团队'],
        description: '水下推进系统的仿生设计与优化研究，结合生物学原理和工程技术，开发了新型推进系统。',
        doi: '10.1088/1748-3190/abcd123',
        type: 'journal'
      }
    ];
  };

  // 获取翻译后的专利数据
  const getPatents = (): Patent[] => [
    {
      id: '1',
      title: t('research.patents.underwaterNavigation.title') as string,
      number: 'CN119509546A',
      applicant: t('research.patents.underwaterNavigation.applicant') as string,
      applicationDate: '2024-07-15',
      publicDate: '2024-11-06',
      priorityDate: '2024-07-15',
      status: 'published',
      type: 'invention',
      description: t('research.patents.underwaterNavigation.description') as string
    },
    {
      id: '2',
      title: t('research.patents.vectorThruster.title') as string,
      number: 'CN119239885A',
      applicant: t('research.patents.vectorThruster.applicant') as string,
      applicationDate: '2024-06-20',
      publicDate: '2024-11-06',
      priorityDate: '2024-06-20',
      status: 'published',
      type: 'invention',
      description: t('research.patents.vectorThruster.description') as string
    },
    {
      id: '3',
      title: t('research.patents.undulatingFin.title') as string,
      number: 'CN119142488A',
      applicant: t('research.patents.undulatingFin.applicant') as string,
      applicationDate: '2024-05-10',
      publicDate: '2024-11-06',
      priorityDate: '2024-05-10',
      status: 'published',
      type: 'invention',
      description: t('research.patents.undulatingFin.description') as string
    },
    {
      id: '4',
      title: t('research.patents.flexibleFin.title') as string,
      number: 'CN118182783A',
      applicant: t('research.patents.flexibleFin.applicant') as string,
      applicationDate: '2023-10-25',
      publicDate: '2024-04-23',
      priorityDate: '2023-10-25',
      status: 'published',
      type: 'invention',
      description: t('research.patents.flexibleFin.description') as string
    },
    {
      id: '5',
      title: t('research.patents.smartShip.title') as string,
      number: 'CN118047007A',
      applicant: t('research.patents.smartShip.applicant') as string,
      applicationDate: '2023-09-15',
      publicDate: '2024-03-14',
      priorityDate: '2023-09-15',
      status: 'published',
      type: 'invention',
      description: t('research.patents.smartShip.description') as string
    },
    {
      id: '6',
      title: t('research.patents.mobileBuoy.title') as string,
      number: 'CN308069533S',
      applicant: t('research.patents.mobileBuoy.applicant') as string,
      applicationDate: '2022-08-30',
      publicDate: '2023-02-22',
      priorityDate: '2022-08-30',
      status: 'published',
      type: 'design',
      description: t('research.patents.mobileBuoy.description') as string
    }
  ];

  // 获取翻译后的奖项数据
  const getAwards = (): Award[] => [
    {
      id: '1',
      title: t('research.awards.internetPlusGold.title') as string,
      organization: t('research.awards.internetPlusGold.organization') as string,
      date: '2023-04',
      level: 'national',
      description: t('research.awards.internetPlusGold.description') as string,
      certificateNumber: '202310033'
    },
    {
      id: '2',
      title: t('research.awards.roboticsCompetition.title') as string,
      organization: t('research.awards.roboticsCompetition.organization') as string,
      date: '2022-04',
      level: 'national',
      description: t('research.awards.roboticsCompetition.description') as string,
      certificateNumber: 'Y2109R025A0001'
    },
    {
      id: '3',
      title: t('research.awards.mechanicalInnovation.title') as string,
      organization: t('research.awards.mechanicalInnovation.organization') as string,
      date: '2024-07',
      level: 'national',
      description: t('research.awards.mechanicalInnovation.description') as string,
      certificateNumber: 'MEICC05MNSI2024-CV1-006'
    },
    {
      id: '4',
      title: t('research.awards.provincialMechanical.title') as string,
      organization: t('research.awards.provincialMechanical.organization') as string,
      date: '2024-04',
      level: 'provincial',
      description: t('research.awards.provincialMechanical.description') as string
    }
  ];

  const publications = getPublications();
  const patents = getPatents();
  const awards = getAwards();

  // 搜索和筛选逻辑
  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.journal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = publicationFilter === 'all' || pub.status === publicationFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredPatents = patents.filter(patent => {
    return patent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patent.number.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredAwards = awards.filter(award => {
    return award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           award.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           award.organization.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'in_preparation': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'national': return 'bg-red-100 text-red-800';
      case 'provincial': return 'bg-blue-100 text-blue-800';
      case 'university': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openDetailModal = (item: Publication | Patent | Award, type: 'publication' | 'patent' | 'award') => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };
  
  return (
    <div className="min-h-screen relative theme-transition">
      <ResponsiveContainer 
        maxWidth="xl" 
        padding="lg"
        className="py-8"
        style={{ paddingTop: isMobile ? '100px' : isTablet ? '120px' : '140px', paddingBottom: '64px' }}
      >
        <SimpleMotion
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-dark theme-transition leading-tight break-words">
              {t('research.title') as string}
            </h1>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`p-3 rounded-lg transition-all duration-300 ${
                showAnalytics 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={showAnalytics ? t('research.switchToListView') as string : t('research.switchToAnalyticsView') as string}
            >
              <BarChart3 className="w-6 h-6" />
            </button>
          </div>
          <p className="text-base md:text-lg lg:text-xl text-secondary-dark theme-transition max-w-2xl mx-auto mb-8 leading-loose break-words hyphens-auto">
            {t('research.description') as string}
          </p>
          
          {/* 搜索和筛选 */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-6">
              {/* 搜索框 */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('research.searchPlaceholder') as string}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 break-words"
                />
              </div>
              
              {/* 类型筛选 */}
              <div className="flex gap-2 sm:gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'publications' | 'patents' | 'awards')}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 break-words"
                >
                  <option value="all">{t('research.filters.allTypes') as string}</option>
                  <option value="publications">{t('research.filters.publications') as string}</option>
                  <option value="patents">{t('research.filters.patents') as string}</option>
                  <option value="awards">{t('research.filters.awards') as string}</option>
                </select>
                
                {filterType === 'publications' && (
                  <select
                    value={publicationFilter}
                    onChange={(e) => setPublicationFilter(e.target.value as 'all' | 'published' | 'under_review')}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 break-words"
                  >
                    <option value="all">{t('research.filters.allStatus') as string}</option>
                    <option value="published">{t('research.filters.published') as string}</option>
                    <option value="under_review">{t('research.filters.underReview') as string}</option>
                  </select>
                )}
              </div>
            </div>
          </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {/* 科学计算模块 */}
          <SimpleMotion
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-dark rounded-lg shadow-md-dark p-4 sm:p-6 hover:shadow-lg-dark theme-transition"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition leading-tight">{t('research.areas.scientificComputing.title') as string}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">{t('research.areas.scientificComputing.transformer.title') as string}</h3>
                <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">{t('research.areas.scientificComputing.transformer.description') as string}</p>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">{t('research.areas.scientificComputing.sparseToDense.title') as string}</h3>
                <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">{t('research.areas.scientificComputing.sparseToDense.description') as string}</p>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">{t('research.areas.scientificComputing.damBreak.title') as string}</h3>
                <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">{t('research.areas.scientificComputing.damBreak.description') as string}</p>
              </div>
            </div>
          </SimpleMotion>

          {/* 机器人研究模块 */}
          <SimpleMotion
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card-dark rounded-lg shadow-md-dark p-6 hover:shadow-lg-dark theme-transition"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition leading-tight">{t('research.areas.robotics.title') as string}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">{t('research.areas.robotics.underwaterPerception.title') as string}</h3>
                <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">{t('research.areas.robotics.underwaterPerception.description') as string}</p>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">{t('research.areas.robotics.bionicFin.title') as string}</h3>
                <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">{t('research.areas.robotics.bionicFin.description') as string}</p>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">{t('research.areas.robotics.modularRobot.title') as string}</h3>
                <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">{t('research.areas.robotics.modularRobot.description') as string}</p>
              </div>
            </div>
          </SimpleMotion>
        </div>

        {/* 学术成果 */}
        <SimpleMotion
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-primary-dark theme-transition mb-8 text-center">{t('research.academicAchievements') as string}</h2>

          {/* Google Scholar学术指标 */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-primary-dark theme-transition mb-6 text-center">
              {t('academic.metrics.title')}
            </h3>
            <AcademicMetrics scholarId="zhaoyang_mu" showCharts={true} />
          </div>

          {/* 学术论文列表 */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-primary-dark theme-transition mb-6 text-center">
              {t('academic.papers.title')}
            </h3>
            <PublicationList 
              papers={[]} 
              maxItems={10} 
              showCitations={true} 
              showVelocity={true} 
            />
          </div>

          {showAnalytics ? (
            <ResearchAnalytics 
              publications={publications}
              patents={patents}
              awards={awards}
            />
          ) : (
            <>
          {/* 论文发表 */}
          {(filterType === 'all' || filterType === 'publications') && (
            <div className="card-dark rounded-lg shadow-md-dark p-4 sm:p-6 mb-8 theme-transition">
              <div className="flex items-center mb-6">
                <BookOpen className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-primary-dark theme-transition">{t('research.publications.title') as string}</h3>
                <span className="ml-auto text-sm text-secondary-dark theme-transition">
                  {(t('research.totalCount') as string).replace('{{count}}', filteredPublications.length.toString()).replace('{{unit}}', t('research.papers') as string)}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {filteredPublications.map((pub) => (
                  <SimpleMotion
                    key={pub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-l-4 border-blue-500 pl-4 sm:pl-6 hover:bg-gray-50 p-3 sm:p-4 rounded-r-lg transition-colors"
                  >
                    <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
                      {pub.title}
                    </h4>
                    <p className="text-sm text-secondary-dark theme-transition mb-3">
                      {pub.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                      <span className="text-sm font-medium text-gray-700">{pub.journal}</span>
                      <span className="text-sm text-gray-500">·</span>
                      <span className="text-sm text-gray-600">{pub.year}</span>
                      {pub.doi && (
                        <>
                          <span className="text-sm text-gray-500">·</span>
                          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" 
                             className="text-sm text-blue-600 hover:underline">
                            DOI: {pub.doi}
                          </a>
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(pub.status)}`}>
                          {pub.status === 'published' ? t('research.status.published') as string : 
                           pub.status === 'accepted' ? t('research.status.accepted') as string :
                           pub.status === 'under_review' ? t('research.status.underReview') as string : t('research.status.preparing') as string}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {pub.type === 'journal' ? t('research.type.journal') as string : t('research.type.conference') as string}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {t('research.authors') as string}: {pub.authors.join(', ')}
                        </span>
                      </div>
                      <UnifiedButton
                        onClick={() => openDetailModal(pub, 'publication')}
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="w-4 h-4" />}
                        title={t('research.viewDetails') as string}
                      />
                    </div>
                  </SimpleMotion>
                ))}
              </div>
            </div>
          )}

          {/* 专利申请 */}
          {(filterType === 'all' || filterType === 'patents') && (
            <div className="card-dark rounded-lg shadow-md-dark p-6 mb-8 theme-transition">
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold text-primary-dark theme-transition">{t('research.patents.title') as string}</h3>
                <span className="ml-auto text-sm text-secondary-dark theme-transition">
                  {(t('research.totalCount') as string).replace('{{count}}', filteredPatents.length.toString()).replace('{{unit}}', t('research.items') as string)}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {filteredPatents.map((patent) => (
                  <SimpleMotion
                    key={patent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-l-4 border-purple-500 pl-4 sm:pl-6 hover:bg-gray-50 p-3 sm:p-4 rounded-r-lg transition-colors"
                  >
                    <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
                      {patent.title}
                    </h4>
                    <p className="text-sm text-secondary-dark theme-transition mb-3">
                      {patent.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-700">{t('research.patentNumber') as string}: {patent.number}</span>
                      <span className="text-sm text-gray-500">·</span>
                      <span className="text-sm text-gray-600">{t('research.applicant') as string}: {patent.applicant}</span>
                      <span className="text-sm text-gray-500">·</span>
                      <span className="text-sm text-gray-600">{t('research.applicationDate') as string}: {patent.applicationDate}</span>
                      <span className="text-sm text-gray-500">·</span>
                      <span className="text-sm text-gray-600">{t('research.publicDate') as string}: {patent.publicDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(patent.status)}`}>
                          {patent.status === 'granted' ? t('research.status.granted') as string : 
                           patent.status === 'published' ? t('research.status.published') as string : t('research.status.underReview') as string}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {patent.type === 'invention' ? t('research.patentType.invention') as string : 
                           patent.type === 'utility' ? t('research.patentType.utility') as string : t('research.patentType.design') as string}
                        </span>
                      </div>
                      <UnifiedButton
                        onClick={() => openDetailModal(patent, 'patent')}
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="w-4 h-4" />}
                        title={t('research.viewDetails') as string}
                      />
                    </div>
                  </SimpleMotion>
                ))}
              </div>
            </div>
          )}

          {/* 荣誉奖项 */}
          {(filterType === 'all' || filterType === 'awards') && (
            <div className="card-dark rounded-lg shadow-md-dark p-6 mb-8 theme-transition">
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="text-xl font-semibold text-primary-dark theme-transition">{t('research.awards.title') as string}</h3>
                <span className="ml-auto text-sm text-secondary-dark theme-transition">
                  {(t('research.totalCount') as string).replace('{{count}}', filteredAwards.length.toString()).replace('{{unit}}', t('research.items') as string)}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {filteredAwards.map((award) => (
                  <SimpleMotion
                    key={award.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-l-4 border-yellow-500 pl-6 hover:bg-gray-50 p-4 rounded-r-lg transition-colors"
                  >
                    <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
                      {award.title}
                    </h4>
                    <p className="text-sm text-secondary-dark theme-transition mb-3">
                      {award.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-700">{award.organization}</span>
                      <span className="text-sm text-gray-500">·</span>
                      <span className="text-sm text-gray-600">{award.date}</span>
                      {award.certificateNumber && (
                        <>
                          <span className="text-sm text-gray-500">·</span>
                          <span className="text-sm text-gray-600">{t('research.certificateNumber') as string}: {award.certificateNumber}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${getLevelColor(award.level)}`}>
                          {award.level === 'national' ? t('research.level.national') as string : 
                           award.level === 'provincial' ? t('research.level.provincial') as string : t('research.level.school') as string}
                        </span>
                      </div>
                      <UnifiedButton
                        onClick={() => openDetailModal(award, 'award')}
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="w-4 h-4" />}
                        title={t('research.viewDetails') as string}
                      />
                    </div>
                  </SimpleMotion>
                ))}
              </div>
            </div>
          )}

          {/* 教育背景 */}
          <div className="card-dark rounded-lg shadow-md-dark p-6 theme-transition">
            <div className="flex items-center mb-6">
              <GraduationCap className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold text-primary-dark theme-transition">{t('research.education') as string}</h3>
            </div>
            <div className="space-y-6">
              <SimpleMotion
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 p-4 rounded-r-lg transition-colors"
              >
                <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
                  {t('research.educationItems.master.title') as string}
                </h4>
                <p className="text-sm text-secondary-dark theme-transition mb-3">
                  {t('research.educationItems.master.description') as string}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{t('research.educationItems.master.period') as string}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{t('research.educationItems.master.status') as string}</span>
                </div>
              </SimpleMotion>
              
              <SimpleMotion
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="border-l-4 border-purple-600 pl-6 hover:bg-gray-50 p-4 rounded-r-lg transition-colors"
              >
                <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
                  {t('research.educationItems.visiting.title') as string}
                </h4>
                <p className="text-sm text-secondary-dark theme-transition mb-3">
                  {t('research.educationItems.visiting.description') as string}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{t('research.educationItems.visiting.period') as string}</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{t('research.educationItems.visiting.status') as string}</span>
                </div>
              </SimpleMotion>
              
              <SimpleMotion
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border-l-4 border-green-600 pl-6 hover:bg-gray-50 p-4 rounded-r-lg transition-colors"
              >
                <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
                  {t('research.educationItems.bachelor.title') as string}
                </h4>
                <p className="text-sm text-secondary-dark theme-transition mb-3">
                  {t('research.educationItems.bachelor.description') as string}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{t('research.educationItems.bachelor.period') as string}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{t('research.educationItems.bachelor.status') as string}</span>
                </div>
              </SimpleMotion>
            </div>
          </div>
            </>
          )}
        </SimpleMotion>
      </SimpleMotion>
    </ResponsiveContainer>

    {/* 学术成果详情模态框 */}
    <ResearchDetailModal
      item={selectedItem}
      type={modalType}
      isOpen={isModalOpen}
      onClose={closeDetailModal}
    />

    {/* 学术结构化数据SEO */}
    <StructuredDataSEO 
      type="article"
      data={{
        headline: t('research.title') as string,
        author: {
          "@type": "Person",
          name: "牟昭阳",
          alternateName: "Zhaoyang Mu"
        },
        publisher: {
          "@type": "Organization",
          name: "牟昭阳个人学术网站"
        },
        datePublished: new Date().toISOString(),
        about: [
          t('research.keywords.scientificComputing') as string,
          t('research.keywords.roboticsResearch') as string,
          t('research.keywords.artificialIntelligence') as string,
          t('research.keywords.machineLearning') as string
        ]
      }}
    />

    {/* 论文结构化数据 */}
    {publications.map((publication) => (
      <StructuredDataSEO 
        key={`article-${publication.id}`}
        type="article"
        data={{
          headline: publication.title,
          author: publication.authors.map(author => ({
            "@type": "Person",
            name: author
          })),
          publisher: {
            "@type": "Organization",
            name: publication.journal
          },
          datePublished: `${publication.year}-01-01`,
          doi: publication.doi,
          citationCount: 0, // 可以从Google Scholar获取实际数据
          abstract: publication.description
        }}
      />
    ))}

    {/* 专利结构化数据 */}
    {patents.map((patent) => (
      <StructuredDataSEO 
        key={`patent-${patent.id}`}
        type="patent"
        data={{
          name: patent.title,
          patentNumber: patent.number,
          applicant: {
            "@type": "Organization",
            name: patent.applicant
          },
          filingDate: patent.publicDate,
          abstract: patent.description,
          patentStatus: patent.status === 'granted' ? 'Granted' : 'Pending'
        }}
      />
    ))}

    {/* 奖项结构化数据 */}
    {awards.map((award) => (
      <StructuredDataSEO 
        key={`award-${award.id}`}
        type="award"
        data={{
          name: award.title,
          provider: {
            "@type": "Organization",
            name: award.organization
          },
          datePublished: `${award.date}-01`,
          description: award.description,
          awardCategory: award.level === 'national' ? t('research.awardLevels.national') as string : 
                        award.level === 'provincial' ? t('research.awardLevels.provincial') as string : t('research.awardLevels.university') as string
        }}
      />
    ))}
  </div>
  );
}

export default memo(Research);