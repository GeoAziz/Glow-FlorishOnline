'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { subscribeToNewsletter } from '@/actions/newsletter';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
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
        title: "Subscribed!",
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm mx-auto items-start space-x-2">
      <div className="flex-1 space-y-1">
        <Input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          disabled={loading}
          className="text-base"
        />
        {errors.email && <p className="text-xs text-destructive text-left">{errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Subscribe
      </Button>
    </form>
  );
}
