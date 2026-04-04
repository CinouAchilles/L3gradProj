import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiCheckCircle, FiShield, FiZap } from "react-icons/fi";

import { MotionWrapperAuth } from "../../components/common/MotionWrapperAuth.jsx";

import PerksPanel from "../../components/common/PerksPanel.jsx";
import PasswordInput from "../../components/common/PasswordInput.jsx";

const perks = [
  {
    icon: FiZap,
    title: "Fast Access",
    description: "Get back to your saved setup and checkout instantly.",
  },
  {
    icon: FiShield,
    title: "Protected Sessions",
    description: "Your account sessions stay secure across your devices.",
  },
  {
    icon: FiCheckCircle,
    title: "Track Everything",
    description: "Review orders, status updates, and your recent activity.",
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormInvalid = loading || !email || !password;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
    setLoading(true);

    setTimeout(() => {
      toast.success("Welcome back to HardWorx.");
      setLoading(false);
      setEmail("");
      setPassword("");
    }, 900);
  };

  return (
    <div className="relative min-h-[78vh] flex items-center justify-center px-2 sm:px-4">
      <MotionWrapperAuth className="relative w-full max-w-4xl">
        <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] lg:grid-cols-2">
          {/* Left perks panel */}
          <MotionWrapperAuth className="relative hidden lg:block p-8 border-r border-white/10">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/10 via-transparent to-cyan-400/10" />
            <div className="relative space-y-6 text-left">
              <p className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                Welcome Back To HardWorx
              </p>

              <h2 className="text-3xl font-bold leading-tight">
                Pick Up Where
                <span className="block text-gradient">You Left Off.</span>
              </h2>

              <p className="text-sm text-slate-300">
                Sign in to continue shopping with personalized picks and instant
                order visibility.
              </p>

              <PerksPanel perks={perks} />
            </div>
          </MotionWrapperAuth>

          {/* Right login form */}
          <div className="p-6 sm:p-8 lg:p-10">
            <h1 className="text-center text-2xl font-bold mb-2">
              <span className="text-gradient">Login</span>
            </h1>

            <p className="mb-6 text-center text-xs text-muted-foreground sm:text-sm">
              Access your account and continue building your rig.
            </p>

            <MotionWrapperAuth
              as="form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition"
              />

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-300">
                  <input type="checkbox" className="checkbox checkbox-xs" />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-cyan-300 hover:text-cyan-200 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                disabled={isFormInvalid}
                className="w-full rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.01] hover:shadow-[0_0_24px_rgba(24,230,245,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {" "}
                {loading ? "Logging in..." : "Log In"}{" "}
              </button>
            </MotionWrapperAuth>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              New here?{" "}
              <Link
                to="/signup"
                className="font-semibold text-cyan-300 hover:text-cyan-200 hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </MotionWrapperAuth>
    </div>
  );
}
