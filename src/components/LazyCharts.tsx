import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

// 懒加载图表组件
const LazyRadarChart = lazy(() => 
  import('recharts').then(module => ({
    default: ({ data, ...props }: any) => {
      const { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } = module;
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name={props.name}
              dataKey="A"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      );
    }
  }))
);

const LazyBarChart = lazy(() => 
  import('recharts').then(module => ({
    default: ({ data, ...props }: any) => {
      const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = module;
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="level" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  }))
);

// 图表加载骨架屏
const ChartSkeleton: React.FC = () => (
  <div className="animate-pulse h-96 bg-gray-200 rounded-lg flex items-center justify-center">
    <div className="text-gray-400">加载图表中...</div>
  </div>
);

// 懒加载雷达图组件
export const LazyRadarChartComponent: React.FC<{ data: any; name: string }> = ({ data, name }) => (
  <Suspense fallback={<ChartSkeleton />}>
    <LazyRadarChart data={data} name={name} />
  </Suspense>
);

// 懒加载柱状图组件
export const LazyBarChartComponent: React.FC<{ data: any }> = ({ data }) => (
  <Suspense fallback={<ChartSkeleton />}>
    <LazyBarChart data={data} />
  </Suspense>
);

// 图表容器组件，支持延迟加载
export const ChartContainer: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
  const [shouldRender, setShouldRender] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShouldRender(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!shouldRender) {
    return <ChartSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};