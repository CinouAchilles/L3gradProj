import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiShoppingCart, FiUser } from "react-icons/fi";

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
      <div className="navbar glass-card rounded-2xl px-4 md:px-6">
        <div className="navbar-start">
          <Link to="/" className="text-xl font-black tracking-wide text-white">
            Neon<span className="text-cyan-400">Rig</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-2 px-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? "active text-cyan-400" : ""
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <form onSubmit={console.log("submit")} className="hidden md:block">
            <label className="input input-bordered h-10 w-56 lg:w-72">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                list="header-search-suggestions"
                placeholder="Search components"
              />
            </label>
            <datalist id="header-search-suggestions">
              {suggestions.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </form>

          <label
            htmlFor="cart-drawer"
            className="btn btn-ghost btn-circle"
            aria-label="Open cart"
          >
            <div className="indicator">
              <FiShoppingCart size={18} />

              <span className="badge badge-xs indicator-item badge-accent">
                500
              </span>
            </div>
          </label>

          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle">
              <FiUser size={18} />
            </button>
            <ul
              tabIndex={0}
              className="menu dropdown-content glass-card z-1 mt-3 w-56 rounded-box p-2"
            >
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Create account</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
