import { AuthForm } from "./components/auth-form";

export default function AuthenticationPage() {
  return (
    <div className="container h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight font-headline">
                Welcome
                </h1>
                <p className="text-sm text-muted-foreground">
                Enter your credentials to access your account
                </p>
            </div>
            <AuthForm />
        </div>
    </div>
  );
}
