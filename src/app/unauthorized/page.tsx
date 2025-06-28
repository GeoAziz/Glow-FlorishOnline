import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ban } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
      <Ban className="h-24 w-24 text-destructive" />
      <h1 className="mt-8 text-4xl font-bold font-headline">Access Denied</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        You do not have the necessary permissions to access this page. Please
        contact an administrator if you believe this is an error.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
