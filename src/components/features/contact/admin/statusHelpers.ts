export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    case 'read':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'replied':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'archived':
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'new':
      return '新消息';
    case 'read':
      return '已读';
    case 'replied':
      return '已回复';
    case 'archived':
      return '已归档';
    default:
      return status;
  }
};
