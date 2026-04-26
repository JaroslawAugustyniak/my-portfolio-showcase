'use client';

import { useLoading } from '@/context/LoadingContext';
import Spinner from './Spinner';

export default function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center pointer-events-none">
      <Spinner />
    </div>
  );
}
