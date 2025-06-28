import { AuthForm } from "./components/auth-form";
import Logo from "@/components/shared/Logo";

export default function AuthenticationPage() {
  return (
    <div className="flex w-full max-w-md flex-col justify-center space-y-6">
      <div className="flex justify-center mb-4">
        <Logo />
      </div>
      <AuthForm />
    </div>
  );
}
