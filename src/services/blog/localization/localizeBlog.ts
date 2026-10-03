import type { BlogCategory, BlogPost, BlogTag, BlogLanguage } from '../../../types';
import { categoryTranslations, tagTranslations } from './taxonomyTranslations';
import { englishPosts } from './englishPosts';

export type { BlogLanguage };

export function localizeBlogPost(post: BlogPost, language: BlogLanguage): BlogPost {
  if (language === 'zh') return { ...post, tags: [...post.tags], metadata: post.metadata && { ...post.metadata } };

  const translation = englishPosts[post.slug] || {};
  return {
    ...post,
    ...translation,
    tags: translation.tags ? [...translation.tags] : post.tags.map((tag) => tagTranslations[tag] || tag),
    metadata: translation.metadata ? { ...translation.metadata } : post.metadata && { ...post.metadata },
  };
}

export function localizeBlogCategory(category: BlogCategory, language: BlogLanguage): BlogCategory {
  if (language === 'zh') return { ...category };
  const translation = categoryTranslations[category.slug];
  return translation ? { ...category, ...translation } : { ...category };
}

export function localizeBlogTag(tag: BlogTag, language: BlogLanguage): BlogTag {
  if (language === 'zh') return { ...tag };
  return { ...tag, name: tagTranslations[tag.name] || tag.name };
}
