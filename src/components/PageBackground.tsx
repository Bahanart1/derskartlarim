interface PageBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function PageBackground({ children, className = "" }: PageBackgroundProps) {
  return (
    <div className={`relative w-full min-h-full ${className}`}>
      <div
        className="pointer-events-none fixed -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl animate-pulse-soft -z-10"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed top-1/3 -right-24 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl animate-pulse-soft -z-10"
        style={{ animationDelay: "1s" }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-0 left-1/3 w-96 h-96 rounded-full bg-violet-400/15 blur-3xl animate-pulse-soft -z-10"
        style={{ animationDelay: "2s" }}
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
