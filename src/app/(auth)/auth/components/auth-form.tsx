"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      toast({
        title: "Success!",
        description: `You have successfully ${isSignUp ? 'signed up' : 'logged in'}. Redirecting...`,
      });
      router.push(redirectUrl);
    } catch (error: any) {
      setFormError(error.message);
      setLoading(false);
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
        "bg-black/30 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl shadow-auth-glow/10",
        formError && "animate-shake-error"
      )}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight text-white">
          {isSignUp ? "Create Your Account" : "Welcome Back"}
        </h1>
        <p className="text-sm text-white/60 mt-2">
          {isSignUp ? "Join the future of elegance." : "Enter your credentials to continue."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <motion.p variants={FADE_IN_VARIANTS} initial="hidden" animate="visible" exit="hidden" className="text-center text-xs text-red-400">{formError}</motion.p>
            )}
          </AnimatePresence>

        <Button disabled={loading} className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105">
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {isSignUp ? "Create Account" : "Sign In"}
        </Button>
      </form>
      
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
