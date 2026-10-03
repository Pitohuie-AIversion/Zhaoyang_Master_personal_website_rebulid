import { BlogCategory } from '../../../../services/blogService';

export const formatBlogDate = (dateString: string, language: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getReadingTimeText = (
  readingTime: number,
  t: (key: string) => string
): string => {
  return `${readingTime} ${t('blog.minutesRead') || '分钟阅读'}`;
};

export const getCategoryColor = (
  categoryName: string,
  categories: BlogCategory[]
): string => {
  const category = categories.find(cat => cat.name === categoryName);
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
  };

  return category?.color ? colorMap[category.color] : colorMap.blue;
};
