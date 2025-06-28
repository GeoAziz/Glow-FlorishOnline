import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareWarning, ShieldCheck } from "lucide-react";

export default function ModeratorDashboardPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold font-headline mb-2">Moderator Dashboard</h1>
      <p className="text-muted-foreground mb-8">Community safety and content review.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Queue</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">72</p>
            <p className="text-xs text-muted-foreground">
              Items pending review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Reports</CardTitle>
            <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">15</p>
            <p className="text-xs text-muted-foreground">
              New reports to address
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
