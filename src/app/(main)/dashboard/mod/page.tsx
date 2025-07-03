
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPendingReviews } from "@/lib/data";

export default async function ModeratorDashboardPage() {
  const pendingReviews = await getPendingReviews();
  
  return (
    <div>
      <h1 className="text-4xl font-bold font-headline mb-2">Moderator Dashboard</h1>
      <p className="text-muted-foreground mb-8">Community safety and content review.</p>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Queue</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingReviews.length}</p>
            <p className="text-xs text-muted-foreground mb-4">
              Items pending review
            </p>
             <Button asChild size="sm">
                <Link href="/dashboard/mod/reviews">Go to Queue</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Moderation Hub</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground pt-4">
                    Welcome to the moderation hub. Your role is vital in maintaining a positive and helpful community. Use the review queue to manage user-submitted content before it appears on the live site.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
