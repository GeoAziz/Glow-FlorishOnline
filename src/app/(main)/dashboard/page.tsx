'use client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/auth?redirect=/dashboard');
      return;
    }

    switch (user.role) {
      case 'admin':
        router.replace('/dashboard/admin');
        break;
      case 'moderator':
        router.replace('/dashboard/mod');
        break;
      case 'user':
      default:
        router.replace('/dashboard/user');
        break;
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
