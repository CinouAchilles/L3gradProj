import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/useUserStore";
import { useCartStore } from "../../stores/useCartStore";

const MotionDiv = motion.div;

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Track Order", to: "/track" },
];

export function Navbar() {
  const [search, setSearch] = useState("");
  const { user, logout } = useUserStore();
  const { fetchCart, getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const role = user?.role;
  const cartCount = getTotalItems();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    fetchCart();
  }, [user, fetchCart]);

  const suggestions = [
    "CPU",
    "GPU",
    "RAM",
    "Motherboard",
    "Storage",
    "Power Supply",
    "Case",
  ];

  const mobileNavItems = [...navItems];

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const q = search.trim();
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
  };
  const closeDrawer = () => {
    const drawer = document.getElementById("mobile-nav-drawer");
    if (drawer) drawer.checked = false;
  };

  useEffect(() => {
    closeDrawer();
  }, [location]);

  return (
    <header className="sticky top-4 z-40 mx-auto w-[95%] max-w-7xl">
      <div className="navbar glass-card rounded-2xl px-3 backdrop-blur-xl border border-white/10 sm:px-4 md:px-6">
        {/* Logo */}
        <div className="navbar-start">
          <Link
            to="/"
            className="text-lg font-black tracking-wide text-white transition hover:opacity-90 sm:text-xl"
          >
            Hard<span className="text-cyan-400">Worx</span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
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
        <div className="navbar-end gap-1 sm:gap-2">
          {/* Search */}
          <form className="hidden md:block" onSubmit={handleSearchSubmit}>
            <label className="relative">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                list="header-search-suggestions"
                placeholder="Search components..."
                className="h-10 w-48 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-slate-400 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 lg:w-72"
              />
            </label>

            <datalist id="header-search-suggestions">
              {suggestions.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </form>

          {/* Mobile Actions */}
          <div className="drawer drawer-end lg:hidden">
            <input
              id="mobile-nav-drawer"
              type="checkbox"
              className="drawer-toggle"
            />

            <div className="drawer-content">
              <div className="flex items-center justify-end gap-1 sm:gap-2">
                <MotionDiv
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    to="/cart"
                    className="btn btn-ghost btn-circle relative"
                    aria-label="Go to cart"
                  >
                    <FiShoppingCart size={18} />

                    {/* Animated Badge */}
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-black">
                      {cartCount}
                    </span>

                    {/* Pulse effect */}
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cyan-400 animate-ping opacity-30"></span>
                  </Link>
                </MotionDiv>

                <MotionDiv
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <label
                    htmlFor="mobile-nav-drawer"
                    className="btn btn-ghost btn-circle"
                    aria-label="Open mobile menu"
                  >
                    <FiMenu size={18} />
                  </label>
                </MotionDiv>
              </div>
            </div>

            <div className="drawer-side z-50">
              <label
                htmlFor="mobile-nav-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              />
              <div className="menu min-h-full w-80 max-w-[90vw] gap-5 bg-slate-950/95 p-5 text-base-content backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <Link
                    to="/"
                    className="text-xl font-black tracking-wide text-white"
                  >
                    Hard<span className="text-cyan-400">Worx</span>
                  </Link>
                  <label
                    htmlFor="mobile-nav-drawer"
                    className="btn btn-ghost btn-circle"
                  >
                    <FiX size={18} />
                  </label>
                </div>

                <div className="space-y-2">
                  {mobileNavItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <Link
                  to="/cart"
                  className="flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-400/15"
                >
                  <span>Cart</span>
                  <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-bold text-black">
                    {cartCount}
                  </span>
                </Link>

                {user && role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 transition hover:border-yellow-400/40 hover:bg-yellow-400/10"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <div className="mt-auto border-t border-white/10 py-4">
                  {!user ? (
                    <div className="grid gap-3">
                      <Link
                        className="rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-4 py-3 text-center font-semibold text-white"
                        to="/login"
                      >
                        Login
                      </Link>
                      <Link
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center font-semibold text-slate-100"
                        to="/signup"
                      >
                        Create account
                      </Link>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      <Link
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center font-semibold text-slate-100"
                        to="/profile"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                        }}
                        className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 font-semibold text-rose-300 transition hover:bg-rose-400/15"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Cart */}
          <MotionDiv
            className="hidden lg:block"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link
              to="/cart"
              className="btn btn-ghost btn-circle relative"
              aria-label="Go to cart"
            >
              <FiShoppingCart size={18} />

              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-black">
                {cartCount}
              </span>

              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cyan-400 animate-ping opacity-30"></span>
            </Link>
          </MotionDiv>

          {/* User Dropdown */}
          <div className="dropdown dropdown-end hidden lg:block">
            <MotionDiv whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <button tabIndex={0} className="btn btn-ghost btn-circle">
                <FiUser size={18} />
              </button>
            </MotionDiv>

            <ul
              tabIndex={0}
              className="menu dropdown-content glass-card z-10 mt-3 w-56 rounded-xl p-2 border border-white/10 backdrop-blur-xl"
            >
              {!user ? (
                <>
                  <li>
                    <Link
                      className="hover:text-cyan-400 transition"
                      to="/login"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="hover:text-cyan-400 transition"
                      to="/signup"
                    >
                      Create account
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      className="hover:text-cyan-400 transition"
                      to="/profile"
                    >
                      Profile
                    </Link>
                  </li>
                  {/* 🔑 Role-based link */}
                  {role === "admin" && (
                    <li>
                      <Link
                        to="/admin"
                        className="hover:text-yellow-400 transition"
                      >
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        logout();
                      }}
                      className="text-left hover:text-red-400 transition"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
