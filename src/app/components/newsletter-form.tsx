"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    setLoading(true);
    const result = await subscribeToNewsletter(data.email);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
      reset();
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
    >
      <div className="flex-1">
        <Input
          type="email"
          placeholder="Enter your email"
          className="text-base"
          {...register("email")}
          disabled={loading}
        />
        {errors.email && (
          <p className="text-xs text-destructive text-left mt-1">
            {errors.email.message}
          </p>
        )}
      </div>
      <Button type="submit" className="font-bold" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Subscribe
      </Button>
    </form>
  );
}
