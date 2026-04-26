import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsFetching } from '@tanstack/react-query';

interface LoadingContextType {
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType>({ isLoading: false });

export function LoadingProvider({ children }: { children: ReactNode }) {
  const isFetching = useIsFetching();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(true);

  // Initial load - pokaż preloader przez 1s
  useEffect(() => {
    const timer = setTimeout(() => setIsNavigating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Na każdą zmianę route - pokaż preloader przez 300ms
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isLoading = isNavigating || isFetching > 0;

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
