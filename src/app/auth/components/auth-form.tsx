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

import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createUserDocument } from "@/actions/user";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

type UserFormValue = z.infer<typeof formSchema>;

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      if (activeTab === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        // Create a corresponding document in Firestore
        await createUserDocument({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
        });
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      toast({
        title: "Success!",
        description: `You have successfully ${activeTab === 'signup' ? 'signed up' : 'logged in'}. Redirecting...`,
      });
      router.push(redirectUrl);
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
       setLoading(false);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="name@example.com"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          disabled={loading}
          {...register("email")}
        />
        {errors.email && (
          <p className="px-1 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          placeholder="••••••••"
          type="password"
          autoCapitalize="none"
          autoComplete="current-password"
          autoCorrect="off"
          disabled={loading}
          {...register("password")}
        />
        {errors.password && (
          <p className="px-1 text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>
      <Button disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {activeTab === "signup" ? "Create Account" : "Sign In"}
      </Button>
    </form>
  );

  return (
    <Tabs defaultValue="login" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">{renderForm()}</TabsContent>
      <TabsContent value="signup">{renderForm()}</TabsContent>
    </Tabs>
  );
}
