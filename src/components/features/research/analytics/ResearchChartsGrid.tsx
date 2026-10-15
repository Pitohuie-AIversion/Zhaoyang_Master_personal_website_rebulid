import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Calendar, PieChart as PieChartIcon, BarChart3, TrendingUp } from 'lucide-react';
import { ChartContainer } from '../../../common/LazyCharts';
import { LazyLineChart, LazyPieChart, LazyBarChart } from './LazyCharts';
import { PieChartData, BarChartData } from './types';

export interface ResearchChartsGridProps {
  yearlyData: { year: string; count: number }[];
  statusChartData: PieChartData[];
  patentChartData: BarChartData[];
  awardChartData: PieChartData[];
}

export const ResearchChartsGrid: React.FC<ResearchChartsGridProps> = ({
  yearlyData,
  statusChartData,
  patentChartData,
  awardChartData,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 年度论文发表趋势 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center mb-6">
          <Calendar className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            年度论文发表趋势
          </h3>
        </div>
        <ChartContainer delay={300}>
          <Suspense fallback={<div className="h-[250px] bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />}>
            <LazyLineChart data={yearlyData} />
          </Suspense>
        </ChartContainer>
      </motion.div>

      {/* 论文状态分布 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center mb-6">
          <PieChartIcon className="w-5 h-5 text-purple-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            论文状态分布
          </h3>
        </div>
        <ChartContainer delay={400}>
          <Suspense fallback={<div className="h-[250px] bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />}>
            <LazyPieChart data={statusChartData} />
          </Suspense>
        </ChartContainer>
      </motion.div>

      {/* 专利类型分布 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center mb-6">
          <BarChart3 className="w-5 h-5 text-green-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            专利类型分布
          </h3>
        </div>
        <ChartContainer delay={500}>
          <Suspense fallback={<div className="h-[250px] bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />}>
            <LazyBarChart data={patentChartData} />
          </Suspense>
        </ChartContainer>
      </motion.div>

      {/* 奖项级别分布 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center mb-6">
          <TrendingUp className="w-5 h-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            奖项级别分布
          </h3>
        </div>
        <ChartContainer delay={600}>
          <Suspense fallback={<div className="h-[250px] bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />}>
            <LazyPieChart data={awardChartData} />
          </Suspense>
        </ChartContainer>
      </motion.div>
    </div>
  );
};
