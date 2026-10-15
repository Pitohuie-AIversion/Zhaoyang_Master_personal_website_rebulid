import React from 'react';
import {
  type ResearchAnalyticsProps,
  useResearchStats,
  ResearchTotalStats,
  ResearchChartsGrid
} from './analytics';

export type { ResearchAnalyticsProps };

export const ResearchAnalytics: React.FC<ResearchAnalyticsProps> = ({
  publications,
  patents,
  awards
}) => {
  const {
    yearlyData,
    statusChartData,
    patentChartData,
    awardChartData,
    totalStats
  } = useResearchStats(publications, patents, awards);

  return (
    <div className="space-y-8">
      {/* 总体统计卡片 */}
      <ResearchTotalStats stats={totalStats} />

      {/* 图表区域 */}
      <ResearchChartsGrid
        yearlyData={yearlyData}
        statusChartData={statusChartData}
        patentChartData={patentChartData}
        awardChartData={awardChartData}
      />
    </div>
  );
};

export default ResearchAnalytics;