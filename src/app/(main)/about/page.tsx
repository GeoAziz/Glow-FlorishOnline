import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Glow & Flourish was born from a simple belief: that beauty is an act of self-care, and self-care is essential to well-being.
          </p>
        </section>

        {/* Image and Mission */}
        <section className="mt-16 md:mt-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-headline mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              We are dedicated to creating premium, minimal, and elegant beauty solutions that are as effective as they are beautiful. We believe in the power of clean, thoughtfully sourced ingredients to nourish your skin, hair, and soul.
            </p>
            <p className="text-muted-foreground">
              Our goal is to empower you to feel confident and radiant in your own skin, providing you with products that become cherished rituals in your daily routine. We're more than a brand; we're a community celebrating the journey to glow and flourish, inside and out.
            </p>
          </div>
          <div className="order-1 md:order-2 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="https://placehold.co/600x700.png"
              alt="Natural ingredients"
              width={600}
              height={700}
              className="w-full h-auto object-cover"
              data-ai-hint="natural ingredients"
            />
          </div>
        </section>

        {/* Our Values */}
        <section className="mt-16 md:mt-24">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-card rounded-lg shadow-sm">
              <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-headline mb-2">Clean Ingredients</h3>
              <p className="text-muted-foreground text-sm">We formulate without parabens, sulfates, or phthalates. Always cruelty-free.</p>
            </div>
            <div className="p-8 bg-card rounded-lg shadow-sm">
              <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-headline mb-2">Sustainable Practices</h3>
              <p className="text-muted-foreground text-sm">We prioritize recyclable packaging and ethically sourced ingredients.</p>
            </div>
            <div className="p-8 bg-card rounded-lg shadow-sm">
              <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-headline mb-2">Proven Efficacy</h3>
              <p className="text-muted-foreground text-sm">Our products are backed by science to deliver visible, tangible results.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 md:mt-24 text-center">
            <h2 className="text-3xl md:text-4xl font-headline mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Explore our collection and find the perfect additions to your self-care ritual.</p>
            <Button asChild size="lg">
                <Link href="/shop">Explore Products</Link>
            </Button>
        </section>
      </div>
    </div>
  );
}
