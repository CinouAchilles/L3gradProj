export function GlowBackground() {
  return (
    //// aria-hidden Hide from screen readers — decorative background only, no semantic content.
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.42),rgba(124,92,255,0)_70%)] blur-2xl" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(24,230,245,0.30),rgba(24,230,245,0)_70%)] blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,68,215,0.20),rgba(255,68,215,0)_70%)] blur-3xl" />
    </div>
  );
}

