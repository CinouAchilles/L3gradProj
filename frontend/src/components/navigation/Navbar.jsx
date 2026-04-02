import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Track Order", to: "/track/demo" },
];

export function Navbar() {
  const [search, setSearch] = useState("");

  const suggestions = [
    "CPU",
    "GPU",
    "RAM",
    "Motherboard",
    "Storage",
    "Power Supply",
    "Case",
  ];

  return (
    <header className="sticky top-4 z-40 mx-auto w-[95%] max-w-7xl">
      <div className="navbar glass-card rounded-2xl px-4 md:px-6 backdrop-blur-xl border border-white/10">
        
        {/* Logo */}
        <div className="navbar-start">
          <Link
            to="/"
            className="text-xl font-black tracking-wide text-white hover:opacity-90 transition"
          >
            Hard<span className="text-cyan-400">Worx</span>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-3 px-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `relative px-2 py-1 transition ${
                      isActive ? "text-cyan-400" : "text-slate-200"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {/* Animated underline */}
                      {isActive && (
                        <MotionDiv
                          layoutId="nav-underline"
                          className="absolute left-0 right-0 -bottom-1 h-0.5 bg-cyan-400 rounded"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side */}
        <div className="navbar-end gap-2">
          
          {/* Search */}
          <form className="hidden md:block">
            <label className="relative">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                list="header-search-suggestions"
                placeholder="Search components..."
                className="h-10 w-56 lg:w-72 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition"
              />
            </label>

            <datalist id="header-search-suggestions">
              {suggestions.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </form>

          {/* Cart */}
          <MotionDiv whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <label
              htmlFor="cart-drawer"
              className="btn btn-ghost btn-circle relative"
              aria-label="Open cart"
            >
              <FiShoppingCart size={18} />

              {/* Animated Badge */}
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-black">
                50
              </span>

              {/* Pulse effect */}
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cyan-400 animate-ping opacity-30"></span>
            </label>
          </MotionDiv>

          {/* User Dropdown */}
          <div className="dropdown dropdown-end">
            <MotionDiv whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <button tabIndex={0} className="btn btn-ghost btn-circle">
                <FiUser size={18} />
              </button>
            </MotionDiv>

            <ul
              tabIndex={0}
              className="menu dropdown-content glass-card z-10 mt-3 w-56 rounded-xl p-2 border border-white/10 backdrop-blur-xl"
            >
              <li>
                <Link className="hover:text-cyan-400 transition" to="/login">
                  Login
                </Link>
              </li>
              <li>
                <Link className="hover:text-cyan-400 transition" to="/signup">
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}