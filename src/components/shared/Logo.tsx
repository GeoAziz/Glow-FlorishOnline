import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Sparkles className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
      <span className="font-headline text-2xl font-bold tracking-tight text-foreground">
        Glow & Flourish
      </span>
    </Link>
  );
}
