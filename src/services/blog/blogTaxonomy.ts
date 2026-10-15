import {
  localizeBlogCategory,
  localizeBlogTag,
  type BlogLanguage,
} from '../blogLocalization';
import type { BlogPost, BlogCategory, BlogTag } from '../../types';

export const deriveCategories = (
  posts: BlogPost[],
  configuredCategories: BlogCategory[],
  language: BlogLanguage = 'zh'
): BlogCategory[] => {
  return configuredCategories.map((category) => {
    const postCount = posts.filter(
      (post) => post.isPublished && post.category === category.name
    ).length;
    return localizeBlogCategory({ ...category, postCount }, language);
  });
};

export const deriveTags = (
  posts: BlogPost[],
  configuredTags: BlogTag[],
  language: BlogLanguage = 'zh'
): BlogTag[] => {
  const tagNames = [
    ...new Set(
      posts
        .filter((post) => post.isPublished)
        .flatMap((post) => post.tags)
    ),
  ];

  return tagNames.map((name, index) => {
    const configuredTag = configuredTags.find((tag) => tag.name === name);
    const tag: BlogTag = {
      id: configuredTag?.id || `dynamic-${index + 1}`,
      name,
      slug: configuredTag?.slug || `tag-${index + 1}`,
      postCount: posts.filter((post) => post.isPublished && post.tags.includes(name)).length,
    };
    return localizeBlogTag(tag, language);
  });
};

export const deriveArchives = (
  posts: BlogPost[]
): { year: number; month: number; count: number }[] => {
  const archiveMap = new Map<string, number>();

  posts
    .filter((post) => post.isPublished)
    .forEach((post) => {
      const date = new Date(post.date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      archiveMap.set(key, (archiveMap.get(key) || 0) + 1);
    });

  return Array.from(archiveMap.entries())
    .map(([key, count]) => {
      const [yearStr, monthStr] = key.split('-');
      return {
        year: parseInt(yearStr, 10),
        month: parseInt(monthStr, 10),
        count,
      };
    })
    .sort((a, b) => b.year - a.year || b.month - a.month);
};
