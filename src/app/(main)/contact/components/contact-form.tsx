"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

import { contactFormSchema, submitContactMessage } from "@/actions/contact";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
    });

    const onSubmit = async (data: ContactFormValues) => {
        setLoading(true);
        const result = await submitContactMessage(data);
        setLoading(false);

        if (result.success) {
            toast({
                title: "Message Sent!",
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your Name" {...register("name")} disabled={loading} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} disabled={loading} />
                 {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    placeholder="Your message..."
                    rows={5}
                    {...register("message")}
                    disabled={loading}
                />
                 {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
            </Button>
        </form>
    );
}
