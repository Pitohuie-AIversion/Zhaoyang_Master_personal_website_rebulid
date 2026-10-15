import { useState, useEffect, useCallback, useRef } from 'react';

export interface LazyImageOptions {
  threshold?: number;
  rootMargin?: string;
  placeholder?: string;
  errorImage?: string;
}

/**
 * 基于 IntersectionObserver 的高性能图片懒加载 Hook
 */
export const useLazyImage = (
  src: string,
  options: LazyImageOptions = {}
) => {
  const [imageSrc, setImageSrc] = useState(options.placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadImage = useCallback(() => {
    if (!src) return;

    setIsLoading(true);
    setError(null);

    const img = new Image();

    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
      if (options.errorImage) {
        setImageSrc(options.errorImage);
      }
    };

    img.src = src;
  }, [src, options.errorImage]);

  const setupIntersectionObserver = useCallback(() => {
    if (!imageRef.current || !window.IntersectionObserver) {
      loadImage();
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            if (observerRef.current && imageRef.current) {
              observerRef.current.unobserve(imageRef.current);
            }
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '50px',
      }
    );

    observerRef.current.observe(imageRef.current);
  }, [loadImage, options.threshold, options.rootMargin]);

  useEffect(() => {
    setupIntersectionObserver();
    const currentImageRef = imageRef.current;

    return () => {
      if (observerRef.current && currentImageRef) {
        observerRef.current.unobserve(currentImageRef);
      }
    };
  }, [setupIntersectionObserver]);

  useEffect(() => {
    if (imageRef.current && imageRef.current.getBoundingClientRect().top < window.innerHeight) {
      loadImage();
    }
  }, [loadImage]);

  return {
    imageSrc,
    isLoading,
    error,
    imageRef,
    retry: loadImage,
  };
};
