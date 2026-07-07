interface PageBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function PageBackground({ children, className = "" }: PageBackgroundProps) {
  return (
    <div className={`flex-1 mesh-bg relative overflow-hidden min-h-screen ${className}`}>
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl animate-pulse-soft"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl animate-pulse-soft"
        style={{ animationDelay: "1s" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-violet-400/15 blur-3xl animate-pulse-soft"
        style={{ animationDelay: "2s" }}
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
