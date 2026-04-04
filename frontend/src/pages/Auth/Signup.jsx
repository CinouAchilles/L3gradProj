import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiCheckCircle, FiShield, FiZap } from "react-icons/fi";
import { motion } from "framer-motion";

import PerksPanel from "../../components/common/PerksPanel.jsx";
import PasswordInput from "../../components/common/PasswordInput.jsx";
import { MotionWrapperAuth } from "../../components/common/MotionWrapperAuth.jsx";

export const MotionDiv = motion.div;
export const MotionForm = motion.form;



const perks = [
  {
    icon: FiZap,
    title: "Fast Checkout",
    description: "Save your details and complete purchases in seconds.",
  },
  {
    icon: FiShield,
    title: "Secure Account",
    description: "Protected with modern security standards for your data.",
  },
  {
    icon: FiCheckCircle,
    title: "Order Tracking",
    description: "Follow each order status from confirmation to delivery.",
  },
];

export default function Signup() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordTooShort = password.length > 0 && password.length < 6;
  const passwordsDoNotMatch =
    confirmPassword.length > 0 && password !== confirmPassword;
  const isFormInvalid =
    loading || passwordTooShort || passwordsDoNotMatch || !name || !email || !password || !confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signing up with:", { name, lastname, email, password, confirmPassword });
    if (passwordTooShort)
      return toast.error("Password must be at least 6 characters");
    if (passwordsDoNotMatch) return toast.error("Passwords do not match");

    setLoading(true);
    setTimeout(() => {
      toast.success("Account created! Welcome to HardWorx.");
      setLoading(false);
      setName("");
      setLastname("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  return (
    <div className="relative min-h-[78vh] flex items-center justify-center px-2 sm:px-4">
      <MotionWrapperAuth className="relative w-full max-w-4xl">
        <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] lg:grid-cols-2">
          {/* Perks Panel */}
          <MotionWrapperAuth className="relative hidden lg:block p-8 border-r border-white/10">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/10 via-transparent to-cyan-400/10" />
            <div className="relative space-y-6 text-left">
              <p className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                Join The HardWorx Community
              </p>
              <h2 className="text-3xl font-bold leading-tight">
                Build Faster.
                <span className="block text-gradient">Game Harder.</span>
              </h2>
              <p className="text-sm text-slate-300">
                Create your account to unlock smart recommendations, saved
                carts, and faster order tracking.
              </p>
              <PerksPanel perks={perks} />
            </div>
          </MotionWrapperAuth>

          {/* Signup Form */}
          <div className="p-6 sm:p-8 lg:p-10">
            <h1 className="text-center text-2xl font-bold mb-2">
              <span className="text-gradient">Create Account</span>
            </h1>
            <p className="mb-6 text-center text-xs text-muted-foreground sm:text-sm">
              Join HardWorx today and get your setup ready.
            </p>

            <MotionWrapperAuth
              as="form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition"
                />
                <input
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Last name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition"
                />
              </div>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition"
              />

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />

              {passwordTooShort && (
                <p className="text-[11px] text-rose-400">
                  Password should be at least 6 characters
                </p>
              )}
              {passwordsDoNotMatch && (
                <p className="text-[11px] text-rose-400">
                  Confirm password must match
                </p>
              )}

              
              <button
                type="submit"
                disabled={isFormInvalid}
                className="w-full rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.01] hover:shadow-[0_0_24px_rgba(24,230,245,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </MotionWrapperAuth>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-cyan-300 hover:text-cyan-200 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </MotionWrapperAuth>
    </div>
  );
}
