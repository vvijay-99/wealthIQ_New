'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LoadingState } from '@/components/state-components';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState === 'unauthenticated') {
      router.replace('/login');
    }
  }, [authState, router]);

  if (authState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState message="Loading your dashboard..." />
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}
