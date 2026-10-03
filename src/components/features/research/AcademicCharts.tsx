import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useTranslation } from '../../common/TranslationProvider';
import { ResponsiveCard } from '../../common/ResponsiveEnhancements';

interface CitationDataPoint {
  year: string | number;
  citations: number;
}

interface AcademicChartsProps {
  yearlyData: CitationDataPoint[];
  trendData: CitationDataPoint[];
}

const AcademicCharts: React.FC<AcademicChartsProps> = ({ yearlyData, trendData }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  );
};

export default AcademicCharts;
