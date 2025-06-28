import { AuthForm } from "./components/auth-form";
import Logo from "@/components/shared/Logo";

export default function AuthenticationPage() {
  return (
    <div className="flex w-full flex-col justify-center items-center space-y-6">
      <div className="flex justify-center mb-4">
        <Logo />
      </div>
      <AuthForm />
    </div>
  );
}
