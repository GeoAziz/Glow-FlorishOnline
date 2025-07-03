
"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-auth-gradient text-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 animate-[scrolling-grid_20s_linear_infinite]" />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
