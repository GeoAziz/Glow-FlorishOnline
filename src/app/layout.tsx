
"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import { WishlistProvider } from "@/context/wishlist-context";
import SplashScreen from "@/components/layout/SplashScreen";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <title>Glow & Flourish Online</title>
        <meta name="description" content="Modern beauty brand selling cosmetics, skincare, wellness products, and self-care items." />
      </head>
      <body className="font-body antialiased">
        {loading ? (
          <SplashScreen onFinished={() => setLoading(false)} />
        ) : (
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
