
"use client";

// This layout is now primarily for styling or structure specific to the moderator section.
// The main role-based authentication and redirection is handled by the parent /dashboard/layout.tsx.
// This prevents conflicting redirection logic and redirect loops.

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
