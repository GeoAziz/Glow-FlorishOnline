"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { createUserDocument } from "@/actions/user";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

type UserFormValue = z.infer<typeof formSchema>;

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.72 1.9-4.25 0-7.62-3.5-7.62-7.8s3.37-7.8 7.62-7.8c2.25 0 3.82.87 4.72 1.73l2.5-2.5C18.12 2.37 15.48 1.4 12.48 1.4c-6.12 0-11.02 4.9-11.02 11s4.9 11 11.02 11c6.48 0 10.72-4.52 10.72-10.82 0-.75-.07-1.47-.2-2.18H12.48z"
      fill="currentColor"
    />
  </svg>
);

const getFirebaseAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please sign in or use a different email.";
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled.";
    case "auth/weak-password":
      return "The password is too weak. Please use a stronger password.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials and try again.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};


export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  const handleAuthSuccess = (user: { uid: string, email: string | null, displayName?: string | null }) => {
    toast({
      title: "Success!",
      description: `You have successfully logged in. Redirecting...`,
    });
    router.push(redirectUrl);
  };

  const handleAuthError = (error: any) => {
    // Don't log common user errors like invalid credentials to the console
    // as they are expected user actions, not application errors.
    const commonAuthErrors = [
      "auth/invalid-credential",
      "auth/user-not-found",
      "auth/wrong-password",
    ];
    if (!commonAuthErrors.includes(error.code)) {
      console.error("Authentication error:", error);
    }
    setFormError(getFirebaseAuthErrorMessage(error.code));
    setLoading(false);
  }

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    setFormError(null);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await createUserDocument({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
        });
        handleAuthSuccess(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        handleAuthSuccess(userCredential.user);
      }
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setFormError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      await createUserDocument({
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
      });

      handleAuthSuccess(result.user);
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    reset();
    setFormError(null);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "bg-black/30 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl shadow-auth-glow/10 w-full max-w-sm",
        formError && "animate-shake-error"
      )}
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight text-white">
          {isSignUp ? "Create Your Account" : "Welcome Back"}
        </h1>
        <p className="text-sm text-white/60 mt-2">
          {isSignUp ? "Join the future of elegance." : "Enter your credentials to continue."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoComplete="email"
            disabled={loading}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12 text-base focus:ring-auth-glow focus:ring-2 focus:border-auth-glow transition-shadow"
            {...register("email")}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p variants={FADE_IN_VARIANTS} initial="hidden" animate="visible" exit="hidden" className="px-1 text-xs text-red-400">{errors.email.message}</motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="space-y-2">
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
            disabled={loading}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12 text-base focus:ring-auth-glow focus:ring-2 focus:border-auth-glow transition-shadow"
            {...register("password")}
          />
           <AnimatePresence>
            {errors.password && (
              <motion.p variants={FADE_IN_VARIANTS} initial="hidden" animate="visible" exit="hidden" className="px-1 text-xs text-red-400">{errors.password.message}</motion.p>
            )}
          </AnimatePresence>
        </div>
         <AnimatePresence>
            {formError && (
              <motion.p variants={FADE_IN_VARIANTS} initial="hidden" animate="visible" exit="hidden" className="text-center text-xs text-red-400 max-w-xs mx-auto">{formError}</motion.p>
            )}
          </AnimatePresence>

        <Button disabled={loading} className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105">
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {isSignUp ? "Create Account" : "Sign In"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black/30 px-2 text-white/60">
            Or continue with
          </span>
        </div>
      </div>
      
      <Button variant="outline" disabled={loading} onClick={handleGoogleSignIn} className="w-full h-12 text-base bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white transition-all duration-300">
        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
        Sign in with Google
      </Button>

      <div className="mt-6 text-center text-sm">
        <p className="text-white/60">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <Button variant="link" onClick={toggleForm} className="font-bold text-primary hover:text-primary/90">
            {isSignUp ? "Sign In" : "Sign Up"}
          </Button>
        </p>
      </div>

    </motion.div>
  );
}
