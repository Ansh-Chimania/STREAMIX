import { useState, useEffect, useCallback } from 'react';

const useInfiniteScroll = (callback, hasMore) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 500
    ) {
      if (hasMore && !isFetching) {
        setIsFetching(true);
      }
    }
  }, [hasMore, isFetching]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetching) return;
    callback().finally(() => setIsFetching(false));
  }, [isFetching, callback]);

  return [isFetching];
};

export default useInfiniteScroll;
