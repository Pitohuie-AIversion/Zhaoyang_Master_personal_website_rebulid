import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, FileText, Users } from 'lucide-react';
import { googleScholarService } from '../../../services/googleScholarService';
import { AcademicMetricsProps, AcademicMetrics as AcademicMetricsType } from '../../../types/academic';
import { useTranslation } from '../../common/TranslationProvider';
import { ResponsiveCard } from '../../common/ResponsiveEnhancements';
import { PageLoader } from '../../common/LoadingComponents';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const AcademicMetrics: React.FC<AcademicMetricsProps> = ({ 
  scholarId = 'zhaoyang_mu', 
  className = '', 
  showCharts = true,
  refreshInterval = 3600000 // 1小时
}) => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<AcademicMetricsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await googleScholarService.getAcademicMetrics(scholarId);
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(t('academic.metrics.error'));
        console.error('Failed to fetch academic metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // 设置自动刷新
    if (refreshInterval > 0) {
      const interval = setInterval(fetchMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [scholarId, refreshInterval, t]);

  if (loading) {
    return (
      <ResponsiveCard className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <PageLoader />
        </div>
      </ResponsiveCard>
    );
  }

  if (error || !metrics) {
    return (
      <ResponsiveCard className={`p-6 ${className}`}>
        <div className="text-center text-red-500">
          <p>{error || t('academic.metrics.notFound')}</p>
        </div>
      </ResponsiveCard>
    );
  }

  const { totalCitations, hIndex, i10Index, totalPapers, yearCitations, citationTrend } = metrics;

  // 准备图表数据
  const yearlyData = Object.entries(yearCitations).map(([year, citations]) => ({
    year,
    citations
  })).sort((a, b) => a.year.localeCompare(b.year));

  const trendData = citationTrend.map((citations, index) => ({
    year: new Date().getFullYear() - 4 + index,
    citations
  }));

  const metricsCards = [
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
      label: t('academic.metrics.totalCitations'),
      value: totalCitations.toLocaleString(),
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: <Award className="w-8 h-8 text-green-500" />,
      label: t('academic.metrics.hIndex'),
      value: hIndex.toString(),
      color: 'bg-green-50 border-green-200'
    },
    {
      icon: <FileText className="w-8 h-8 text-yellow-500" />,
      label: t('academic.metrics.i10Index'),
      value: i10Index.toString(),
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      label: t('academic.metrics.totalPapers'),
      value: totalPapers.toString(),
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsCards.map((card, index) => (
          <ResponsiveCard key={index} className={`p-4 border-2 ${card.color} hover:shadow-lg transition-shadow`}>
            <div className="flex items-center space-x-3">
              {card.icon}
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </ResponsiveCard>
        ))}
      </div>

      {/* 图表展示 */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 年度引用分布 */}
          <ResponsiveCard className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              {t('academic.metrics.yearlyCitations')}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, t('academic.metrics.citations')]}
                  labelFormatter={(label) => `${t('academic.metrics.year')}: ${label}`}
                />
                <Bar dataKey="citations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ResponsiveCard>

          {/* 引用趋势 */}
          <ResponsiveCard className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              {t('academic.metrics.citationTrend')}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, t('academic.metrics.totalCitations')]}
                  labelFormatter={(label) => `${t('academic.metrics.year')}: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="citations" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ResponsiveCard>
        </div>
      )}

      {/* 详细说明 */}
      <ResponsiveCard className="p-4 bg-gray-50">
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>{t('academic.metrics.aboutHIndex')}:</strong> {t('academic.metrics.hIndexDescription')}</p>
          <p><strong>{t('academic.metrics.aboutI10Index')}:</strong> {t('academic.metrics.i10IndexDescription')}</p>
          <p className="text-xs text-gray-500 mt-3">
            {t('academic.metrics.dataSource')}: Google Scholar | {t('academic.metrics.lastUpdated')}: {new Date().toLocaleDateString()}
          </p>
        </div>
      </ResponsiveCard>
    </div>
  );
};

export default AcademicMetrics;