import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiPackage } from "react-icons/fi";
import GPUModel from "../Mod/GPUModel";

const MotionSpan = motion.span;
const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionDiv = motion.div;
const MotionLink = motion(Link);

export function HeroSection() {
  return (
    <section 
    className="grid min-h-[82vh] items-center gap-12 py-4 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:px-4 xl:px-10"
    style={{
      rowGap: 0
    }}
    >
      <div className="space-y-7">
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
          className="text-4xl font-bold leading-tight md:text-6xl xl:text-7xl"
        >
          Build A Rig That Feels{" "}
          <span className="block bg-linear-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
            Unreal In Every Frame
          </span>
        </MotionH1>
        <MotionP
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="max-w-2xl text-slate-300"
        >
          Explore premium components, tuned bundles, and performance-first parts
          selected for gamers, beginners, and enthusiasts.
        </MotionP>
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="flex flex-wrap gap-4"
        >
          <MotionLink
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 35px rgba(24,230,245,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            to={"/shop"}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-md transition"
          >
            <FiShoppingCart size={20} /> Shop Now
          </MotionLink>

          <MotionLink
            whileHover={{
              scale: 1.03,
              backgroundColor: "rgba(255,255,255,0.12)",
              borderColor: "hsl(248 100% 68%)",
            }}
            whileTap={{ scale: 0.97 }}
            to={"/track"}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-slate-100 transition"
          >
            <FiPackage size={20} /> Track Order
          </MotionLink>
        </MotionDiv>
      </div>
      <MotionDiv
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, delay: 0.2 }}
        className="flex justify-center lg:justify-end"
      >
        <MotionDiv
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, repeatType: "loop" }}
          className="relative h-80 w-full max-w-xl  sm:h-96 lg:h-128"
        >
          <GPUModel />
        </MotionDiv>
      </MotionDiv>
      {/* Scroll Down Indicator */}
      <div className="opacity-100 lg:col-span-2 text-center items-center hidden lg:block mt-18">
        <MotionDiv
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="w-6 h-10 rounded-3xl border-2 border-slate-400 flex justify-center items-start p-1">
            <MotionDiv
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-2 h-2 rounded-full bg-slate-400"
            />
          </div>
          <span className="mt-2 text-sm text-slate-400">Scroll Down</span>
        </MotionDiv>
      </div>
    </section>
  );
}
