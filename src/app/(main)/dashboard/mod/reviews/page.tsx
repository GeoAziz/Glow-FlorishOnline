
import { getPendingReviews } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ReviewActions } from "./components/review-actions";
import { format } from "date-fns";

export default async function ReviewModerationPage() {
    const pendingReviews = await getPendingReviews();

    return (
        <div>
            <h1 className="text-4xl font-bold font-headline mb-2">Review Queue</h1>
            <p className="text-muted-foreground mb-8">
                Approve or reject new product reviews submitted by users.
            </p>

            {pendingReviews.length > 0 ? (
                <div className="space-y-6">
                    {pendingReviews.map(review => (
                        <Card key={review.id}>
                            <CardHeader className="flex flex-row justify-between items-start gap-4">
                                <div className="flex-grow">
                                    <CardTitle>
                                        Review for <Link href={`/product/${review.productSlug}`} className="text-primary hover:underline">{review.productName}</Link>
                                    </CardTitle>
                                    <div className="text-sm text-muted-foreground mt-1 space-x-2">
                                        <span>By {review.author}</span>
                                        <span>•</span>
                                        <span>{format(new Date(review.createdAt), "MMM d, yyyy")}</span>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                                        ))}
                                        {[...Array(5 - review.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 text-muted-foreground/30" />
                                        ))}
                                    </div>
                                </div>
                                <ReviewActions productId={review.productId} reviewId={review.id} />
                            </CardHeader>
                            <CardContent>
                                <p className="italic">"{review.text}"</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <ShieldCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold">All Clear!</h2>
                    <p className="text-muted-foreground mt-2">
                        There are no pending reviews to moderate.
                    </p>
                </div>
            )}
        </div>
    );
}
