import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export interface ResearchStatItem {
  title: string;
  count: number;
  icon: LucideIcon;
  color: string;
  published: number;
}

export interface ResearchTotalStatsProps {
  stats: ResearchStatItem[];
}

export const ResearchTotalStats: React.FC<ResearchTotalStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
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
                {stat.title === '论文发表'
                  ? '已发表'
                  : stat.title === '专利申请'
                  ? '已授权/公开'
                  : '国家级'}
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {stat.published}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
