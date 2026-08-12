'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LoadingState } from '@/components/state-components';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authState, authError, refreshSession } = useAuth();
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
    if (authError) {
      return <div className="flex min-h-screen items-center justify-center p-6"><div className="max-w-md rounded-lg border border-danger/30 bg-card p-6 text-center"><h1 className="text-lg font-semibold">We couldn&apos;t initialize your session</h1><p className="mt-2 text-sm text-muted-foreground">{authError}</p><button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={() => void refreshSession()}>Try again</button></div></div>;
    }
    return null;
  }

  return <>{children}</>;
}
