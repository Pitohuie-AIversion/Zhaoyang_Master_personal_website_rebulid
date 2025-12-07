import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Award, BookOpen, FileText, Briefcase, GraduationCap, ChevronDown, ChevronUp, Filter, ExternalLink } from 'lucide-react';
import { SimpleMotion } from '../animations/SimpleMotion';
import { useTranslation } from './TranslationProvider';
import { UnifiedButton } from './UnifiedButton';
import { useResponsive } from '../../hooks/useResponsive';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'education' | 'research' | 'publication' | 'patent' | 'award' | 'project' | 'skill';
  location?: string;
  organization?: string;
  tags?: string[];
  metadata?: {
    doi?: string;
    patentNumber?: string;
    certificateNumber?: string;
    impact?: number;
    citations?: number;
    url?: string;
    gpa?: number;
    level?: string;
  };
  isHighlighted?: boolean;
}

interface TimelineProps {
  items?: TimelineItem[];
  maxItems?: number;
  showFilters?: boolean;
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ 
  items: providedItems,
  maxItems = 20,
  showFilters = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 默认时间线数据
  const defaultItems: TimelineItem[] = [
    {
      id: '1',
      title: 'DAMFormer: A Deep Learning Approach for Sparse-to-Dense Modeling',
      description: 'Published a novel transformer-based architecture for sparse-to-dense modeling in scientific computing applications.',
      date: '2025-01',
      type: 'publication',
      organization: 'Journal of Computational Physics',
      metadata: {
        doi: '10.1063/5.0187644',
        citations: 15,
        impact: 3.1,
        url: 'https://doi.org/10.1063/5.0187644'
      },
      tags: ['Deep Learning', 'Scientific Computing', 'Transformer'],
      isHighlighted: true
    },
    {
      id: '2',
      title: 'RS-ModCubes: Remote Sensing Data Processing Framework',
      description: 'Developed advanced modular cube processing framework for remote sensing data analysis and visualization.',
      date: '2025-01',
      type: 'publication',
      organization: 'Remote Sensing Journal',
      metadata: {
        citations: 8,
        impact: 2.8
      },
      tags: ['Remote Sensing', 'Data Processing', 'Visualization']
    },
    {
      id: '3',
      title: 'Underwater Robot Navigation System',
      description: 'Patented innovative underwater robot autonomous navigation and positioning system based on multi-sensor fusion.',
      date: '2024-11',
      type: 'patent',
      organization: 'Research Institution',
      metadata: {
        patentNumber: 'CN119509546A'
      },
      tags: ['Underwater Robotics', 'Navigation', 'Sensor Fusion']
    },
    {
      id: '4',
      title: 'Vector Thruster Control Algorithm',
      description: 'Developed novel vector thruster control algorithm to improve underwater robot maneuverability.',
      date: '2024-11',
      type: 'patent',
      organization: 'Research Institution',
      metadata: {
        patentNumber: 'CN119239885A'
      },
      tags: ['Vector Thruster', 'Control Algorithm', 'Maneuverability']
    },
    {
      id: '5',
      title: 'Gold Award - Internet+ Innovation Competition',
      description: 'Won national gold award for AI-based underwater robot system.',
      date: '2023-04',
      type: 'award',
      organization: 'Ministry of Education',
      location: 'China',
      metadata: {
        certificateNumber: '202310033'
      },
      tags: ['AI', 'Underwater Robotics', 'Innovation'],
      isHighlighted: true
    },
    {
      id: '6',
      title: 'Master of Science - Computer Science',
      description: 'Completed master\'s degree with focus on artificial intelligence and robotics.',
      date: '2023-06',
      type: 'education',
      organization: 'Top University',
      location: 'China',
      metadata: {
        gpa: 3.8
      },
      tags: ['Computer Science', 'AI', 'Robotics']
    },
    {
      id: '7',
      title: 'Intelligent Underwater Robot System',
      description: 'Led development of integrated perception, decision-making, and control platform for underwater robots.',
      date: '2024-06',
      type: 'project',
      organization: 'Research Lab',
      metadata: {
        url: 'https://github.com/zhaoyang-mu/underwater-robot'
      },
      tags: ['Underwater Robotics', 'Perception', 'Decision Making']
    },
    {
      id: '8',
      title: 'Advanced Python Programming',
      description: 'Mastered advanced Python development including scientific computing, machine learning, and web development.',
      date: '2022-12',
      type: 'skill',
      metadata: {
        level: 'Expert'
      },
      tags: ['Python', 'Scientific Computing', 'Machine Learning', 'Web Development']
    }
  ];

  const items = providedItems || defaultItems;

  // 类型图标映射
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'education': return <GraduationCap className="w-5 h-5" />;
      case 'research': return <BookOpen className="w-5 h-5" />;
      case 'publication': return <BookOpen className="w-5 h-5" />;
      case 'patent': return <FileText className="w-5 h-5" />;
      case 'award': return <Award className="w-5 h-5" />;
      case 'project': return <Briefcase className="w-5 h-5" />;
      case 'skill': return <Calendar className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  // 类型颜色映射
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'education': return 'bg-blue-500';
      case 'research': return 'bg-purple-500';
      case 'publication': return 'bg-green-500';
      case 'patent': return 'bg-orange-500';
      case 'award': return 'bg-yellow-500';
      case 'project': return 'bg-indigo-500';
      case 'skill': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  // 处理筛选
  const filteredItems = useMemo(() => {
    let filtered = items;
    
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(item => selectedTypes.includes(item.type));
    }

    return filtered;
  }, [items, selectedTypes]);

  // 处理排序
  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortOrder === 'desc' 
            ? new Date(b.date).getTime() - new Date(a.date).getTime()
            : new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'type':
          return sortOrder === 'desc'
            ? b.type.localeCompare(a.type)
            : a.type.localeCompare(b.type);
        case 'title':
          return sortOrder === 'desc'
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return sorted.slice(0, maxItems);
  }, [filteredItems, sortBy, sortOrder, maxItems]);

  // 切换项目展开状态
  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' });
  };

  // 类型标签
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      education: t('timeline.types.education') || '教育',
      research: t('timeline.types.research') || '研究',
      publication: t('timeline.types.publication') || '论文',
      patent: t('timeline.types.patent') || '专利',
      award: t('timeline.types.award') || '奖项',
      project: t('timeline.types.project') || '项目',
      skill: t('timeline.types.skill') || '技能'
    };
    return labels[type] || type;
  };

  const allTypes = ['education', 'research', 'publication', 'patent', 'award', 'project', 'skill'];

  return (
    <div className={`relative ${className}`}>
      {/* 筛选和排序控件 */}
      {showFilters && (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('timeline.filters') || '筛选'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTypes.map(type => (
                <button
                  key={type}
                  onClick={() => {
                    if (selectedTypes.includes(type)) {
                      setSelectedTypes(selectedTypes.filter(t => t !== type));
                    } else {
                      setSelectedTypes([...selectedTypes, type]);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTypes.includes(type)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {getTypeLabel(type)}
                </button>
              ))}
              {selectedTypes.length > 0 && (
                <button
                  onClick={() => setSelectedTypes([])}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                >
                  {t('timeline.clearFilters') || '清除筛选'}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('timeline.sortBy') || '排序'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'type' | 'title')}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="date">{t('timeline.sortByDate') || '按日期'}</option>
                <option value="type">{t('timeline.sortByType') || '按类型'}</option>
                <option value="title">{t('timeline.sortByTitle') || '按标题'}</option>
              </select>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>
      )}

      {/* 时间线 */}
      <div className="relative">
        {/* 时间线主轴 */}
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>

        {sortedItems.map((item, index) => (
          <SimpleMotion
            key={item.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative mb-8 ${item.isHighlighted ? 'bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-400' : ''}`}
          >
            {/* 时间线节点 */}
            <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${getTypeColor(item.type)}`}>
              {getTypeIcon(item.type)}
            </div>

            {/* 内容 */}
            <div className="ml-12 sm:ml-16">
              {/* 标题和基本信息 */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {item.date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(item.date)}
                      </div>
                    )}
                    {item.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {item.location}
                      </div>
                    )}
                    {item.organization && (
                      <span className="font-medium">{item.organization}</span>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.type === 'education' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  item.type === 'publication' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  item.type === 'patent' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                  item.type === 'award' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  item.type === 'project' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {getTypeLabel(item.type)}
                </span>
              </div>

              {/* 描述 */}
              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                {item.description}
              </p>

              {/* 元数据 */}
              {item.metadata && (
                <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
                  {item.metadata.doi && (
                    <a
                      href={`https://doi.org/${item.metadata.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      DOI: {item.metadata.doi}
                    </a>
                  )}
                  {item.metadata.patentNumber && (
                    <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      Patent: {item.metadata.patentNumber}
                    </span>
                  )}
                  {item.metadata.citations && (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {item.metadata.citations} citations
                    </span>
                  )}
                  {item.metadata.impact && (
                    <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      Impact Factor: {item.metadata.impact}
                    </span>
                  )}
                  {item.metadata.certificateNumber && (
                    <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      Certificate: {item.metadata.certificateNumber}
                    </span>
                  )}
                </div>
              )}

              {/* 标签 */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 展开/收起按钮 */}
              {item.metadata?.url && (
                <div className="flex items-center justify-between">
                  <a
                    href={item.metadata.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
                  >
                    查看详情
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </SimpleMotion>
        ))}

        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {t('timeline.noItems') || '暂无时间线项目'}
            </p>
          </div>
        )}
      </div>

      {/* 加载更多 */}
      {filteredItems.length > maxItems && (
        <div className="text-center mt-8">
          <UnifiedButton
            variant="outline"
            onClick={() => { /* 可以添加加载更多逻辑 */ }}
          >
            {t('timeline.loadMore') || '加载更多'}
          </UnifiedButton>
        </div>
      )}
    </div>
  );
};

export default Timeline;