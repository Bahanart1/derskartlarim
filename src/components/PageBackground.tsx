interface PageBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function PageBackground({ children, className = "" }: PageBackgroundProps) {
  return (
    <>
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
        aria-hidden
      >
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl animate-pulse-soft" />
        <div
          className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl animate-pulse-soft"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-violet-400/15 blur-3xl animate-pulse-soft"
          style={{ animationDelay: "2s" }}
        />
      </div>
      <div className={`relative w-full min-h-screen ${className}`}>
        <div className="relative z-10">{children}</div>
      </div>
    </>
  );
}
