import React, { useState, useEffect, memo } from 'react';
import { SimpleMotion } from '../components/SimpleMotion';
import { Search, Filter, BookOpen, Award, FileText, Calendar, Users, ExternalLink, GraduationCap, MapPin, Clock, BarChart3, Eye } from 'lucide-react';
import { UnifiedButton } from '../components/UnifiedButton';
import { useResponsive } from '../hooks/useResponsive';
import { useTranslation } from '../components/TranslationProvider';
import { ResearchAnalytics } from '../components/ResearchAnalytics';
import { ResearchDetailModal } from '../components/ResearchDetailModal';
import { ResponsiveContainer } from '../components/ResponsiveEnhancements';

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
  publicDate: string;
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

  // 论文数据
  const publications: Publication[] = [
    {
      id: '1',
      title: 'Generalizing morphologies in dam break simulations using transformer model',
      journal: 'Physics of Fluids',
      year: 2025,
      status: 'published',
      authors: ['牟昭阳', '徐敏义'],
      description: '基于Transformer架构的溃坝流场预测模型，实现跨几何边界的泛化预测能力',
      doi: '10.1063/5.0187644',
      type: 'journal'
    },
    {
      id: '2',
      title: 'Rs-ModCubes: Self-reconfigurable, scalable, modular cubic robots for underwater operations',
      journal: 'IEEE Robotics and Automation Letters',
      year: 2025,
      status: 'published',
      authors: ['牟昭阳', '范迪夏'],
      description: '自重构模块化立方体水下机器人系统设计与实现',
      type: 'journal'
    },
    {
      id: '3',
      title: 'Deep-Learning-Assisted Triboelectric Whisker Sensor Array for Underwater Robot Navigation',
      journal: 'Advanced Materials Technologies',
      year: 2025,
      status: 'published',
      authors: ['牟昭阳', '徐敏义'],
      description: '深度学习辅助的摩擦电触须传感器阵列用于水下机器人导航',
      type: 'journal'
    },
    {
      id: '4',
      title: 'Deep-learning-assisted triboelectric whisker sensor for underwater robot perception',
      journal: 'Nano Energy',
      year: 2024,
      status: 'published',
      authors: ['牟昭阳', '徐敏义'],
      description: '深度学习辅助的摩擦电触须传感器用于水下机器人感知',
      doi: '10.1016/j.nanoen.2024.110011',
      type: 'journal'
    },
    {
      id: '5',
      title: 'Sparse-to-Dense Field Reconstruction using Transformer Architecture',
      journal: 'Under Review',
      year: 2024,
      status: 'under_review',
      authors: ['牟昭阳', '徐敏义'],
      description: '面向CFD/环境流的稀疏传感器数据重建高分辨率时空场技术研究',
      type: 'journal'
    }
  ];

  // 专利数据
  const patents: Patent[] = [
    {
      id: '1',
      title: '水下机器人动态环境感知和导航装置及方法',
      number: 'CN119509546A',
      applicant: '西湖大学',
      publicDate: '2024-11-06',
      status: 'published',
      type: 'invention',
      description: '一种基于多传感器融合的水下机器人环境感知与导航系统'
    },
    {
      id: '2',
      title: '基于矢量八推布局的水下机器人',
      number: 'CN119239885A',
      applicant: '西湖大学',
      publicDate: '2024-11-06',
      status: 'published',
      type: 'invention',
      description: '采用矢量八推进器布局的高机动性水下机器人设计'
    },
    {
      id: '3',
      title: '基于波动鳍推进的水下机器人',
      number: 'CN119142488A',
      applicant: '西湖大学',
      publicDate: '2024-11-06',
      status: 'published',
      type: 'invention',
      description: '仿生波动鳍推进机制的水下机器人系统'
    },
    {
      id: '4',
      title: '内嵌多传感器的柔性鳍水下机器人及运行方法',
      number: 'CN118182783A',
      applicant: '大连海事大学',
      publicDate: '2024-04-23',
      status: 'published',
      type: 'invention',
      description: '集成多种传感器的柔性仿生鳍水下机器人'
    },
    {
      id: '5',
      title: '具有智能动态感应系统的船舶',
      number: 'CN118047007A',
      applicant: '大连海事大学',
      publicDate: '2024-03-14',
      status: 'published',
      type: 'invention',
      description: '配备智能动态感应系统的新型船舶设计'
    },
    {
      id: '6',
      title: '移动式浮标机器人',
      number: 'CN308069533S',
      applicant: '西湖大学',
      publicDate: '2023-02-22',
      status: 'published',
      type: 'design',
      description: '移动式海洋观测浮标机器人外观设计'
    }
  ];

  // 荣誉奖项数据
  const awards: Award[] = [
    {
      id: '1',
      title: '第八届中国国际"互联网+"大学生创新创业大赛 · 金奖',
      organization: '教育部',
      date: '2023-04',
      level: 'national',
      description: '项目：《鲲鹏科技——水下船体检测机器人领军者》',
      certificateNumber: '202310033'
    },
    {
      id: '2',
      title: '2021中国机器人大会（暨RoboCup中国赛）· 水下机器人水中巡游 一等奖',
      organization: '中国自动化学会',
      date: '2022-04',
      level: 'national',
      description: '团队：大连海事大学"海大机建一队"',
      certificateNumber: 'Y2109R025A0001'
    },
    {
      id: '3',
      title: '中国大学生机械工程创新创意大赛 · "明石杯"微纳传感技术与智能应用赛道 一等奖',
      organization: '教育部高等学校机械类专业教学指导委员会',
      date: '2024-07',
      level: 'national',
      description: '参赛作品：《深蓝视觉融合水下机器人》',
      certificateNumber: 'MEICC05MNSI2024-CV1-006'
    },
    {
      id: '4',
      title: '辽宁省大学生机械创新设计大赛 · 铜奖',
      organization: '辽宁省教育厅',
      date: '2024-04',
      level: 'provincial',
      description: '作品：《深蓝智感——基于摩擦纳米发电机的水下触觉传感器》'
    }
  ];

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
    <div className="min-h-screen bg-primary-dark theme-transition">
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
              {t('research.title')}
            </h1>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`p-3 rounded-lg transition-all duration-300 ${
                showAnalytics 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={showAnalytics ? t('research.switchToListView') : t('research.switchToAnalyticsView')}
            >
              <BarChart3 className="w-6 h-6" />
            </button>
          </div>
          <p className="text-base md:text-lg lg:text-xl text-secondary-dark theme-transition max-w-2xl mx-auto mb-8 leading-loose break-words hyphens-auto">
            {t('research.description')}
          </p>
          
          {/* 搜索和筛选 */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-6">
              {/* 搜索框 */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('research.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 break-words"
                />
              </div>
              
              {/* 类型筛选 */}
              <div className="flex gap-2 sm:gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 break-words"
                >
                  <option value="all">{t('research.filters.allTypes')}</option>
                  <option value="publications">{t('research.filters.publications')}</option>
                  <option value="patents">{t('research.filters.patents')}</option>
                  <option value="awards">{t('research.filters.awards')}</option>
                </select>
                
                {filterType === 'publications' && (
                  <select
                    value={publicationFilter}
                    onChange={(e) => setPublicationFilter(e.target.value as any)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 break-words"
                  >
                    <option value="all">{t('research.filters.allStatus')}</option>
                    <option value="published">{t('research.filters.published')}</option>
                    <option value="under_review">{t('research.filters.underReview')}</option>
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
              <h2 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition leading-tight">{t('research.areas.scientificComputing.title')}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">{t('research.areas.scientificComputing.transformer.title')}</h3>
                <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">{t('research.areas.scientificComputing.transformer.description')}</p>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">{t('research.areas.scientificComputing.sparseToDense.title')}</h3>
                <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">{t('research.areas.scientificComputing.sparseToDense.description')}</p>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">{t('research.areas.scientificComputing.damBreak.title')}</h3>
                <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">{t('research.areas.scientificComputing.damBreak.description')}</p>
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
              <h2 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition leading-tight">{t('research.areas.robotics.title')}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">{t('research.areas.robotics.underwaterPerception.title')}</h3>
                <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">{t('research.areas.robotics.underwaterPerception.description')}</p>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">{t('research.areas.robotics.bionicFin.title')}</h3>
                <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">{t('research.areas.robotics.bionicFin.description')}</p>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-medium text-primary-dark theme-transition mb-1 leading-snug">{t('research.areas.robotics.modularRobot.title')}</h3>
                <p className="text-sm md:text-base text-secondary-dark theme-transition leading-relaxed">{t('research.areas.robotics.modularRobot.description')}</p>
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
          <h2 className="text-2xl font-semibold text-primary-dark theme-transition mb-8 text-center">{t('research.academicAchievements')}</h2>

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
                <h3 className="text-xl font-semibold text-primary-dark theme-transition">{t('research.publications')}</h3>
                <span className="ml-auto text-sm text-secondary-dark theme-transition">
                  {t('research.totalCount').replace('{{count}}', filteredPublications.length.toString()).replace('{{unit}}', t('research.papers'))}
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
                          {pub.status === 'published' ? t('research.status.published') : 
                           pub.status === 'accepted' ? t('research.status.accepted') :
                           pub.status === 'under_review' ? t('research.status.underReview') : t('research.status.preparing')}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {pub.type === 'journal' ? t('research.type.journal') : t('research.type.conference')}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {t('research.authors')}: {pub.authors.join(', ')}
                        </span>
                      </div>
                      <UnifiedButton
                        onClick={() => openDetailModal(pub, 'publication')}
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="w-4 h-4" />}
                        title={t('research.viewDetails')}
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
                <h3 className="text-xl font-semibold text-primary-dark theme-transition">{t('research.patents')}</h3>
                <span className="ml-auto text-sm text-secondary-dark theme-transition">
                  {t('research.totalCount').replace('{{count}}', filteredPatents.length.toString()).replace('{{unit}}', t('research.items'))}
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
                      <span className="text-sm font-medium text-gray-700">{t('research.patentNumber')}: {patent.number}</span>
                      <span className="text-sm text-gray-500">·</span>
                      <span className="text-sm text-gray-600">{t('research.applicant')}: {patent.applicant}</span>
                      <span className="text-sm text-gray-500">·</span>
                      <span className="text-sm text-gray-600">{t('research.publicDate')}: {patent.publicDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(patent.status)}`}>
                          {patent.status === 'granted' ? t('research.status.granted') : 
                           patent.status === 'published' ? t('research.status.published') : t('research.status.underReview')}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {patent.type === 'invention' ? t('research.patentType.invention') : 
                           patent.type === 'utility' ? t('research.patentType.utility') : t('research.patentType.design')}
                        </span>
                      </div>
                      <UnifiedButton
                        onClick={() => openDetailModal(patent, 'patent')}
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="w-4 h-4" />}
                        title="查看详情"
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
                <h3 className="text-xl font-semibold text-primary-dark theme-transition">{t('research.awards')}</h3>
                <span className="ml-auto text-sm text-secondary-dark theme-transition">
                  {t('research.totalCount').replace('{{count}}', filteredAwards.length.toString()).replace('{{unit}}', t('research.items'))}
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
                          <span className="text-sm text-gray-600">{t('research.certificateNumber')}: {award.certificateNumber}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${getLevelColor(award.level)}`}>
                          {award.level === 'national' ? t('research.level.national') : 
                           award.level === 'provincial' ? t('research.level.provincial') : t('research.level.school')}
                        </span>
                      </div>
                      <UnifiedButton
                        onClick={() => openDetailModal(award, 'award')}
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="w-4 h-4" />}
                        title="查看详情"
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
              <h3 className="text-xl font-semibold text-primary-dark theme-transition">{t('research.education')}</h3>
            </div>
            <div className="space-y-6">
              <SimpleMotion
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 p-4 rounded-r-lg transition-colors"
              >
                <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
                  大连海事大学 - 人工智能硕士
                </h4>
                <p className="text-sm text-secondary-dark theme-transition mb-3">
                  专业：人工智能（0812J1）| 导师：徐敏义 教授 | 人工智能学院
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">2023.08 - 2026.06（预计）</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">在读</span>
                </div>
              </SimpleMotion>
              
              <SimpleMotion
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="border-l-4 border-purple-600 pl-6 hover:bg-gray-50 p-4 rounded-r-lg transition-colors"
              >
                <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
                  西湖大学 - 访问学生/研究助理
                </h4>
                <p className="text-sm text-secondary-dark theme-transition mb-3">
                  工学院 i⁴-FSI 实验室（PI：范迪夏）| 方向：仿生波动鳍推进仿真
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">2024.06 - 至今</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">访问学者</span>
                </div>
              </SimpleMotion>
              
              <SimpleMotion
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border-l-4 border-green-600 pl-6 hover:bg-gray-50 p-4 rounded-r-lg transition-colors"
              >
                <h4 className="text-lg font-medium text-primary-dark theme-transition mb-2">
                  大连海事大学 - 材料科学与工程学士
                </h4>
                <p className="text-sm text-secondary-dark theme-transition mb-3">
                  专业：材料科学与工程（高分子）| GPA 3.2/4.0（82/100）| 专业排名 7/100
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">2019.09 - 2023.06</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">工学学士</span>
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
  </div>
  );
}

export default memo(Research);