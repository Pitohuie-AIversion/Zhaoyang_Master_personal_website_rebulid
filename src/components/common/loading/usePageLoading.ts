import React from 'react';

export const usePageLoading = (initialLoading = true) => {
  const [isLoading, setIsLoading] = React.useState(initialLoading);

  React.useEffect(() => {
    if (initialLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500); // 1.5秒后隐藏加载动画

      return () => clearTimeout(timer);
    }
  }, [initialLoading]);

  return { isLoading, setIsLoading };
};
