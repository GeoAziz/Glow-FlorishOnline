import { AdvisorClient } from "./components/advisor-client";

export default function RoutineAdvisorPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
          Personalized Routine Advisor
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Answer a few questions about your skin, and our AI-powered expert will
          craft a personalized skincare routine just for you.
        </p>
      </div>

      <AdvisorClient />
    </div>
  );
}
