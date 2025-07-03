import { Suspense } from 'react';
import { AuthForm } from "./components/auth-form";
import Logo from "@/components/shared/Logo";
import { Skeleton } from "@/components/ui/skeleton";

// A simple fallback that mimics the size of the AuthForm
function AuthFormFallback() {
  return <Skeleton className="h-[490px] w-full max-w-sm rounded-2xl" />;
}


export default function AuthenticationPage() {
  return (
    <div className="flex w-full flex-col justify-center items-center space-y-6">
      <div className="flex justify-center mb-4">
        <Logo />
      </div>
      <Suspense fallback={<AuthFormFallback />}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
