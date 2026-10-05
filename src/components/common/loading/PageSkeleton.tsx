import React from 'react';
import {
  SkeletonCard,
  ProjectCardSkeleton,
  ResearchHighlightSkeleton,
  NewsItemSkeleton
} from './SkeletonCards';

export const PageSkeleton: React.FC<{ type: 'home' | 'projects' | 'research' }> = ({ type }) => {
  if (type === 'home') {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section Skeleton */}
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6" />
                <div className="space-y-2 mb-8">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-4/5" />
                </div>
                <div className="flex space-x-3">
                  <div className="h-10 bg-gray-200 rounded w-24" />
                  <div className="h-10 bg-gray-200 rounded w-24" />
                </div>
              </div>
              <div className="animate-pulse">
                <div className="w-64 h-64 lg:w-80 lg:h-80 bg-gray-200 rounded-lg mx-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Research Highlights Skeleton */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4" />
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto" />
            </div>
            <ResearchHighlightSkeleton />
          </div>
        </section>

        {/* News Section Skeleton */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4" />
              <div className="h-4 bg-gray-200 rounded w-80 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <NewsItemSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (type === 'projects') {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="animate-pulse mb-8">
            <div className="h-10 bg-gray-200 rounded w-48 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-96" />
          </div>

          {/* Filters Skeleton */}
          <div className="animate-pulse mb-8">
            <div className="flex flex-wrap gap-4">
              <div className="h-10 bg-gray-200 rounded w-64" />
              <div className="h-10 bg-gray-200 rounded w-32" />
              <div className="h-10 bg-gray-200 rounded w-24" />
            </div>
          </div>

          {/* Projects Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-64 mb-8" />
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
