
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ban } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UnauthorizedPage() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center overflow-hidden h-screen w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10"
      >
        <div className="relative text-destructive font-bold text-6xl md:text-9xl tracking-widest uppercase">
          <span className="absolute top-0 left-0 w-full h-full animate-glitch-top">Access Denied</span>
          <span className="animate-glitch">Access Denied</span>
          <span className="absolute top-0 left-0 w-full h-full animate-glitch-bottom">Access Denied</span>
        </div>
        
        <p className="mt-8 text-lg text-white/80">
          You do not have clearance for this sector.
        </p>
        <p className="mt-2 text-sm text-white/60">
          Your attempt has been logged.
        </p>
        <div className="mt-12 flex gap-4">
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="bg-transparent text-white hover:bg-white/10">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
