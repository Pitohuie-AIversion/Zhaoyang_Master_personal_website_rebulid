import DOMPurify from 'dompurify';

export const renderMarkdown = (content: string): string => {
  const rawHtml = content
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br>')
    .replace(/\$\$(.+?)\$\$/g, '<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm">$1</code></div>')
    .replace(/\$(.+?)\$/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/\|(.+?)\|/g, '<span class="border border-gray-300 dark:border-gray-600 px-2 py-1 rounded text-sm">$1</span>');

  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'strong', 'em', 'br', 'div', 'code', 'span', 'a', 'ul', 'ol', 'li', 'blockquote'],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel']
  });
};

export const formatBlogDate = (dateString: string, language: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
