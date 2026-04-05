import { motion } from "framer-motion";

const MotionDiv = motion.div;

export function GlassPanel({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function AnimatedGlassPanel({
  className = "",
  children,
  initial = { opacity: 0, y: 12 },
  animate = { opacity: 1, y: 0 },
  transition,
}) {
  return (
    <MotionDiv
      initial={initial}
      animate={animate}
      transition={transition}
      className={`rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl ${className}`}
    >
      {children}
    </MotionDiv>
  );
}

export function AdminStatCard({ icon, label, value, delay = 0 }) {
  const IconComponent = icon;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-[0_10px_28px_rgba(0,0,0,0.25)]"
    >
      <div className="mb-3 inline-flex rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-300">
        <IconComponent className="h-5 w-5" />
      </div>
      <p className="text-lg font-bold text-slate-100 sm:text-xl">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
    </MotionDiv>
  );
}

export function SectionHeader({ icon, title }) {
  const IconComponent = icon;

  return (
    <div className="mb-4 flex items-center gap-2">
      <IconComponent className="h-4 w-4 text-cyan-300" />
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
        {title}
      </h3>
    </div>
  );
}

export function StatusPill({ label, className }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase ${className}`}
    >
      {label}
    </span>
  );
}
