import { motion } from "framer-motion";

const MotionDiv = motion.div;

export default function PerksPanel({ perks }) {
  return (
    <div className="space-y-4">
      {perks.map((perk, index) => {
        const Icon = perk.icon;
        return (
          <MotionDiv
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 , delay: 0.2 + index * 0.08}}
            key={perk.title}
            className="flex items-start gap-3"
          >
            <div className="mt-0.5 rounded-lg border border-white/10 bg-white/5 p-2 text-cyan-300">
              <Icon size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">
                {perk.title}
              </p>
              <p className="text-xs text-slate-400">{perk.description}</p>
            </div>
          </MotionDiv>
        );
      })}
    </div>
  );
}
