import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionSpan = motion.span;
const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionDiv = motion.div;

export function HeroSection() {
  return (
    <section className="grid items-center gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <MotionSpan
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200"
        >
          Precision Hardware For Gamers And Creators
        </MotionSpan>
        <MotionH1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-4xl font-bold leading-tight md:text-6xl"
        >
          Build A Rig That Feels
          <span className="block bg-linear-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
            Unreal In Every Frame
          </span>
        </MotionH1>
        <MotionP
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="max-w-xl text-slate-300"
        >
          Explore premium components, tuned bundles, and performance-first parts
          selected for gamers, beginners, and enthusiasts.
        </MotionP>
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="flex flex-wrap gap-3"
        >
          <Link
            to={"/shop"}
            className="rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-3 font-semibold text-white shadow-[0_0_28px_rgba(24,230,245,0.35)] transition hover:scale-[1.02]"
          >
            Shop Now
          </Link>
          <Link
            to={"/tracking"}
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-slate-100 transition hover:bg-white/10"
          >
            Track Order
          </Link>
        </MotionDiv>
      </div>
      <MotionDiv
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="w-37.5 h-37.5 bg-red-700">

        </div>
      </MotionDiv>
    </section>
  );
}

