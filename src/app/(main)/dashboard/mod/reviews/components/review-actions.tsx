
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { approveReview, rejectReview } from "@/actions/review";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X } from "lucide-react";

interface ReviewActionsProps {
    productId: string;
    reviewId: string;
}

export function ReviewActions({ productId, reviewId }: ReviewActionsProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleApprove = () => {
        startTransition(async () => {
            const result = await approveReview(productId, reviewId);
            if (result.success) {
                toast({ title: "Review Approved" });
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        });
    };

    const handleReject = () => {
        startTransition(async () => {
            const result = await rejectReview(productId, reviewId);
            if (result.success) {
                toast({ title: "Review Rejected" });
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        });
    };
    
    if (isPending) {
        return <Loader2 className="h-5 w-5 animate-spin" />;
    }

    return (
        <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleApprove}>
                <Check className="h-4 w-4 mr-2" />
                Approve
            </Button>
            <Button size="sm" variant="destructive" onClick={handleReject}>
                <X className="h-4 w-4 mr-2" />
                Reject
            </Button>
        </div>
    );
}
