import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, Calendar, User, BarChart3 } from 'lucide-react';
import { googleScholarService } from '../../../services/googleScholarService';
import { PublicationMetrics, PaperListProps } from '../../../types/academic';
import { useTranslation } from '../../common/TranslationProvider';
import { ResponsiveCard } from '../../common/ResponsiveEnhancements';
import { PageLoader } from '../../common/LoadingComponents';

export const PublicationList: React.FC<PaperListProps> = ({
  papers: externalPapers = [],
  maxItems = 10,
  showCitations = true,
  showVelocity = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const [papers, setPapers] = useState<PublicationMetrics[]>(externalPapers);
  const [loading, setLoading] = useState(externalPapers.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'year' | 'citations' | 'velocity'>('year');
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
        const data = await googleScholarService.getPublicationMetrics('zhaoyang_mu');
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
  const processedPapers = papers
    .filter(paper => filterYear === 'all' || paper.year.toString() === filterYear)
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

  // 获取年份选项
  const yearOptions = Array.from(new Set(papers.map(p => p.year.toString()))).sort((a, b) => Number(b) - Number(a));

  if (loading) {
    return (
      <ResponsiveCard className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <PageLoader />
        </div>
      </ResponsiveCard>
    );
  }

  if (error) {
    return (
      <ResponsiveCard className={`p-6 ${className}`}>
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </ResponsiveCard>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 筛选和排序控件 */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            {t('academic.papers.sortBy')}:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="year">{t('academic.papers.year')}</option>
            <option value="citations">{t('academic.papers.citations')}</option>
            <option value="velocity">{t('academic.papers.citationVelocity')}</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            {t('academic.papers.filterYear')}:
          </label>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('academic.papers.allYears')}</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 论文列表 */}
      <div className="space-y-4">
        {processedPapers.map((paper, index) => (
          <PaperCard 
            key={index} 
            paper={paper} 
            showCitations={showCitations}
            showVelocity={showVelocity}
          />
        ))}
      </div>

      {/* 统计信息 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{papers.length}</div>
            <div className="text-sm text-gray-600">{t('academic.papers.totalPapers')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {papers.reduce((sum, p) => sum + p.citations, 0)}
            </div>
            <div className="text-sm text-gray-600">{t('academic.papers.totalCitations')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {papers.length > 0 ? Math.round(papers.reduce((sum, p) => sum + p.citations, 0) / papers.length) : 0}
            </div>
            <div className="text-sm text-gray-600">{t('academic.papers.avgCitations')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 论文卡片组件
const PaperCard: React.FC<{ 
  paper: PublicationMetrics; 
  showCitations: boolean;
  showVelocity: boolean;
}> = ({ paper, showCitations, showVelocity }) => {
  const { t } = useTranslation();

  return (
    <ResponsiveCard className="p-4 hover:shadow-md transition-shadow border-l-4 border-blue-500">
      <div className="space-y-3">
        {/* 论文标题 */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight flex-1">
            {paper.title}
          </h3>
          {paper.url && (
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition-colors p-1"
              title={t('academic.papers.viewPaper')}
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* 作者信息 */}
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>{paper.authors.join(', ')}</span>
        </div>

        {/* 期刊和年份 */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="font-medium">{paper.journal}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{paper.year}</span>
          </div>
        </div>

        {/* 引用统计 */}
        {(showCitations || showVelocity) && (
          <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
            {showCitations && (
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-gray-600">
                  {t('academic.papers.citations')}: 
                  <span className="font-semibold text-green-600">{paper.citations}</span>
                </span>
              </div>
            )}
            
            {showVelocity && (
              <div className="flex items-center text-sm">
                <BarChart3 className="w-4 h-4 mr-1 text-blue-500" />
                <span className="text-gray-600">
                  {t('academic.papers.citationVelocity')}: 
                  <span className="font-semibold text-blue-600">
                    {paper.citationVelocity.toFixed(1)}/年
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* DOI链接 */}
        {paper.doi && (
          <div className="text-xs text-gray-500 mt-2">
            DOI: <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {paper.doi}
            </a>
          </div>
        )}
      </div>
    </ResponsiveCard>
  );
};

export default PublicationList;