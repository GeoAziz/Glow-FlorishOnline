"use client";

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  onFinished: () => void;
}

const Starfield = () => (
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_60%)] opacity-0 animate-[twinkle_5s_infinite_alternate]"></div>
        <div className="absolute w-1/2 h-1/2 top-1/4 left-1/4 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_50%)] opacity-0 animate-[twinkle_7s_infinite_alternate_1s]"></div>
    </div>
);


export default function SplashScreen({ onFinished }: SplashScreenProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),   // Background effects
      setTimeout(() => setStage(2), 1000),  // Logo
      setTimeout(() => setStage(3), 2000),  // Tagline
      setTimeout(() => setStage(4), 4000),  // Start fade out
      setTimeout(() => onFinished(), 5000), // Fully finished
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onFinished]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-splash-gradient overflow-hidden transition-opacity duration-1000",
        stage >= 4 ? "opacity-0" : "opacity-100"
      )}
    >
      {/* Background Effects */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500",
          stage >= 1 && "opacity-100"
        )}
      >
        <Starfield />
        <div className="absolute inset-0 bg-grid-pattern animate-[scrolling-grid_5s_linear_infinite]" />
      </div>
      

      {/* Centerpiece */}
      <div className="relative z-10 text-center">
        <div
          className={cn(
            "relative mb-4 inline-block opacity-0",
            stage >= 2 && "animate-[fade-in-pulse_1s_ease-out_forwards]"
          )}
        >
          <Sparkles className="h-24 w-24 text-splash-cyan drop-shadow-[0_0_15px_hsl(var(--splash-cyan-hsl))]" />
           <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-splash-gold drop-shadow-[0_0_10px_hsl(var(--splash-gold-hsl))]" />
        </div>

        {/* Tagline */}
        <div
          className={cn(
            "relative font-headline text-3xl text-splash-pale-white opacity-0",
             stage >= 3 && "animate-[fade-in_1s_ease-out_forwards]"
          )}
        >
          Glow & Flourish
        </div>
        <p
          className={cn(
            "h-6 font-body text-lg text-splash-gold opacity-0 whitespace-nowrap overflow-hidden",
             stage >= 3 && "animate-[typewriter_1.2s_steps(18,end)_forwards]"
          )}
        >
          Elegance, Evolved.
        </p>
      </div>
      
       {/* Scanline */}
       <div className={cn(
           "absolute top-0 left-0 w-full h-full z-20 pointer-events-none",
           "bg-scanline-gradient opacity-0",
           stage >=3 && "animate-[scanline_4s_linear]"
        )} />

    </div>
  );
}
