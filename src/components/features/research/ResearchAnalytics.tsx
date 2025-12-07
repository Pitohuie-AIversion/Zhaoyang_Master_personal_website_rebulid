import React from 'react';
import { ChartContainer } from '../../common/LazyCharts';
import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Calendar } from 'lucide-react';

// ChartData interface removed - not used in this file

interface PieChartData {
  name: string;
  value: number;
}

interface BarChartData {
  name: string;
  value: number;
}

// 懒加载图表组件
const LazyLineChart = lazy(() => 
  import('recharts/es6').then(module => ({
    default: ({ data }: { data: Record<string, unknown>[] }) => {
      const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = module;
      return (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  }))
);

const LazyPieChart = lazy(() => 
  import('recharts/es6').then(module => ({
    default: ({ data }: { data: PieChartData[] }) => {
      const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = module;
      const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
       return (
         <ResponsiveContainer width="100%" height={250}>
           <PieChart>
             <Pie
               data={data}
               cx="50%"
               cy="50%"
               labelLine={false}
               label={(props: { name?: string; percent?: number }) => `${props.name || ''} ${((props.percent || 0) * 100).toFixed(0)}%`}
               outerRadius={80}
               fill="#8884d8"
               dataKey="value"
             >
               {data.map((entry, index: number) => (
                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
               ))}
             </Pie>
             <Tooltip />
           </PieChart>
         </ResponsiveContainer>
      );
    }
  }))
);

const LazyBarChart = lazy(() => 
  import('recharts/es6').then(module => ({
    default: ({ data }: { data: BarChartData[] }) => {
      const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = module;
      return (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  }))
);

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

interface ResearchAnalyticsProps {
  publications: Publication[];
  patents: Patent[];
  awards: Award[];
}



export const ResearchAnalytics: React.FC<ResearchAnalyticsProps> = ({
  publications,
  patents,
  awards
}) => {
  // 按年份统计论文发表数量
  const publicationsByYear = publications.reduce((acc, pub) => {
    const year = pub.year.toString();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const yearlyData = Object.entries(publicationsByYear)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  // 论文状态分布
  const statusData = publications.reduce((acc, pub) => {
    const status = pub.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    name: status === 'published' ? '已发表' : 
          status === 'accepted' ? '已接收' :
          status === 'under_review' ? '审稿中' : '准备中',
    value: count,
    status
  }));

  // 专利类型分布
  const patentTypeData = patents.reduce((acc, patent) => {
    const type = patent.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const patentChartData = Object.entries(patentTypeData).map(([type, count]) => ({
    name: type === 'invention' ? '发明专利' : 
          type === 'utility' ? '实用新型' : '外观设计',
    value: count
  }));

  // 奖项级别分布
  const awardLevelData = awards.reduce((acc, award) => {
    const level = award.level;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const awardChartData = Object.entries(awardLevelData).map(([level, count]) => ({
    name: level === 'national' ? '国家级' : 
          level === 'provincial' ? '省级' : '校级',
    value: count
  }));

  // 总体统计数据
  const totalStats = [
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
  ];

  return (
    <div className="space-y-8">
      {/* 总体统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {totalStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.count}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  {stat.title === '论文发表' ? '已发表' : 
                   stat.title === '专利申请' ? '已授权/公开' : '国家级'}
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {stat.published}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 图表区域 */}
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
    </div>
  );
};