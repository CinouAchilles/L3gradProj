import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionLink = motion(Link);

export function NotFound() {
  return (
    <section className="relative flex py-[15%] flex-col items-center justify-center text-center">

      <MotionH1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-7xl md:text-9xl font-extrabold bg-linear-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent"
      >
        404
      </MotionH1>

      <MotionP
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 max-w-md text-slate-300"
      >
        The page you’re looking for doesn’t exist or has been moved.
      </MotionP>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex flex-wrap justify-center gap-4"
      >
        <MotionLink
          to="/"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 35px rgba(24,230,245,0.5)",
          }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-md"
        >
          <FiHome size={18} /> Back Home
        </MotionLink>
          {/* "TODO: create a component for the buttons " */}
        <MotionLink
          to={-1}
          whileHover={{
            scale: 1.03,
            backgroundColor: "rgba(255,255,255,0.12)",
            borderColor: "hsl(248 100% 68%)",
          }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-slate-100"
        >
          <FiArrowLeft size={18} /> Go Back
        </MotionLink>
      </MotionDiv>
    </section>
  );
}
