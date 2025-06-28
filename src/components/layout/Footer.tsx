import Link from "next/link";
import { Twitter, Instagram, Facebook } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm max-w-xs">
              Elegant beauty solutions for the modern individual.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=Skin" className="hover:text-primary transition-colors">Skincare</Link></li>
              <li><Link href="/shop?category=Hair" className="hover:text-primary transition-colors">Hair</Link></li>
              <li><Link href="/shop?category=Makeup" className="hover:text-primary transition-colors">Makeup</Link></li>
              <li><Link href="/shop?category=Wellness" className="hover:text-primary transition-colors">Wellness</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold">About Us</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/our-story" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold">Follow Us</h3>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></a>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-border" />
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Glow & Flourish. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
