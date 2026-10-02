import { useMemo } from 'react';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { Publication, Patent, Award, PieChartData, BarChartData } from './types';

export const useResearchStats = (
  publications: Publication[],
  patents: Patent[],
  awards: Award[]
) => {
  // 按年份统计论文发表数量
  const yearlyData = useMemo(() => {
    const publicationsByYear = publications.reduce((acc, pub) => {
      const year = pub.year.toString();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(publicationsByYear)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [publications]);

  // 论文状态分布
  const statusChartData: PieChartData[] = useMemo(() => {
    const statusData = publications.reduce((acc, pub) => {
      const status = pub.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusData).map(([status, count]) => ({
      name:
        status === 'published'
          ? '已发表'
          : status === 'accepted'
          ? '已接收'
          : status === 'under_review'
          ? '审稿中'
          : '准备中',
      value: count,
      status
    }));
  }, [publications]);

  // 专利类型分布
  const patentChartData: BarChartData[] = useMemo(() => {
    const patentTypeData = patents.reduce((acc, patent) => {
      const type = patent.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(patentTypeData).map(([type, count]) => ({
      name:
        type === 'invention'
          ? '发明专利'
          : type === 'utility'
          ? '实用新型'
          : '外观设计',
      value: count
    }));
  }, [patents]);

  // 奖项级别分布
  const awardChartData: PieChartData[] = useMemo(() => {
    const awardLevelData = awards.reduce((acc, award) => {
      const level = award.level;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(awardLevelData).map(([level, count]) => ({
      name:
        level === 'national'
          ? '国家级'
          : level === 'provincial'
          ? '省级'
          : '校级',
      value: count
    }));
  }, [awards]);

  // 总体统计数据
  const totalStats = useMemo(() => [
    {
      title: '论文发表',
      count: publications.length,
      icon: BarChart3,
      color: 'bg-blue-500',
      published: publications.filter(p => p.status === 'published').length
    },
    {
      title: '专利申请',
      count: patents.length,
      icon: PieChartIcon,
      color: 'bg-purple-500',
      published: patents.filter(p => p.status === 'granted' || p.status === 'published').length
    },
    {
      title: '荣誉奖项',
      count: awards.length,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      published: awards.filter(a => a.level === 'national').length
    }
  ], [publications, patents, awards]);

  return {
    yearlyData,
    statusChartData,
    patentChartData,
    awardChartData,
    totalStats
  };
};
