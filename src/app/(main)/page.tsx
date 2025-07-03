import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts, getTestimonials } from "@/lib/data";
import { ArrowRight, Star } from "lucide-react";
import { ProductCard } from "./shop/components/product-card";
import { NewsletterForm } from "@/components/newsletter-form";

export default async function Home() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.slice(0, 4);
  const testimonials = await getTestimonials();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full">
        <Image
          src="https://placehold.co/1600x900.png"
          alt="Woman with glowing skin"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
          data-ai-hint="glowing skin"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4 bg-black bg-opacity-30">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold mb-4 drop-shadow-lg">
            Embrace Your Natural Radiance
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md">
            Discover our curated collection of clean, effective, and elegant
            beauty solutions designed to make you glow from within.
          </p>
          <Button asChild size="lg" className="font-bold text-lg">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-4">
            Featured Products
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            A selection of our community's favorite products, crafted with care
            and the finest ingredients.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/shop">
                Explore All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">
            What Our Community Says
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card text-card-foreground">
                <CardHeader>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">"{testimonial.text}"</p>
                </CardContent>
                <CardFooter>
                  <p className="font-bold">{testimonial.name}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-lg p-8 md:p-12 lg:p-16 max-w-4xl mx-auto text-center shadow-lg">
            <h2 className="text-3xl md:text-4xl font-headline mb-4">
              Join the Glow-Getters
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for exclusive tips, new product
              launches, and special offers.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
