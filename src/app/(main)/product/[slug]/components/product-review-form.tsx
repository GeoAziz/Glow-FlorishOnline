"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { submitReview } from "@/actions/review";
import { reviewFormSchema, type ReviewFormValues } from "@/lib/schemas/review";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductReviewFormProps {
    productId: string;
    productSlug: string;
}

export function ProductReviewForm({ productId, productSlug }: ProductReviewFormProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isPending, startTransition] = React.useTransition();
    const [hoverRating, setHoverRating] = useState(0);

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewFormSchema),
        defaultValues: {
            productId: productId,
            slug: productSlug,
            rating: 0,
            text: "",
            author: user?.displayName || "Anonymous",
        },
    });

    const currentRating = form.watch("rating");

    const onSubmit = (data: ReviewFormValues) => {
        if (!user) {
            toast({ title: "Login required", description: "You must be logged in to submit a review.", variant: "destructive" });
            return;
        }

        startTransition(async () => {
            const result = await submitReview({ ...data, author: user.displayName || "Anonymous" });
            if (result.success) {
                toast({ title: "Success!", description: result.message });
                form.reset({
                    ...form.getValues(),
                    rating: 0,
                    text: "",
                });
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        });
    };

    if (!user) {
        return <p className="text-sm text-muted-foreground pt-4 border-t">Please <Link href="/auth" className="underline text-primary">log in</Link> to leave a review.</p>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 border-t">
                 <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Rating</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={cn(
                                                "h-6 w-6 cursor-pointer transition-colors",
                                                (hoverRating >= star || currentRating >= star) 
                                                    ? "text-primary fill-primary" 
                                                    : "text-muted-foreground/50"
                                            )}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onClick={() => field.onChange(star)}
                                        />
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Review</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Share your thoughts on this product..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Review
                </Button>
            </form>
        </Form>
    );
}
