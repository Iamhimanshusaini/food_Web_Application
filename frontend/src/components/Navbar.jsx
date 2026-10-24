
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  UserRound,
  Menu,
  X,
  LogOut,
  House,
  CircleUserRound,
  ClipboardList,
  Headset,
  ChevronRight,
  MapPin,
} from "lucide-react";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();

  const nav = [
    ["/", "Home"],
    ["/restaurants", "Restaurants"],
    // ["/orders", "Orders"],
  ];

  const closeSidebar = () => setProfileOpen(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setOpen(false);
    navigate("/login");
  };

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    "Customer";

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">

          {/* Logo */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2 text-2xl font-extrabold text-gray-900 transition-transform duration-300 hover:scale-105"
          >
            <span className="transition-transform duration-300 group-hover:rotate-12">
              🍔
            </span>
            <span>
              Food<span className="text-orange-500">ly</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div
            className={`${open
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-2 opacity-0 md:visible md:translate-y-0 md:opacity-100"
              } absolute left-0 right-0 top-full flex flex-col gap-1 border-b bg-white p-4 shadow-lg transition-all duration-300 md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
          >
            {nav.map(([path, label]) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group relative rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300 hover:bg-orange-50 hover:text-orange-600 active:scale-95 ${isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600"
                  }`
                }
              >
                {label}
                <span className="absolute bottom-1 left-3 right-3 h-0.5 origin-left scale-x-0 rounded-full bg-orange-500 transition-transform duration-300 group-hover:scale-x-100" />
              </NavLink>
            ))}
          </div>

          {/* Navbar Actions */}
          <div className="flex shrink-0 items-center gap-2">

            {/* Favorites */}
            <Link
              to="/favorites"
              title="Favorites"
              className="group relative rounded-xl p-2.5 text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-500 active:scale-90"
            >
              <Heart
                size={20}
                className="transition-transform duration-300 group-hover:-rotate-12"
              />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              title="Cart"
              className="group relative rounded-xl p-2.5 text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-orange-50 hover:text-orange-500 active:scale-90"
            >
              <ShoppingBag
                size={21}
                className="transition-transform duration-300 group-hover:-rotate-6"
              />

              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 animate-in items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Login / Profile */}
            {user?.role === "user" ? (
              <button
                onClick={() => {
                  setProfileOpen(true);
                  setOpen(false);
                }}
                className="group flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 py-1.5 pl-1.5 pr-3 text-gray-800 transition-all duration-300 hover:scale-105 hover:border-orange-300 hover:bg-orange-100 hover:shadow-md active:scale-95"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 font-bold text-white shadow-sm transition-transform duration-300 group-hover:rotate-6">
                  {avatarLetter}
                </span>

                <span className="hidden max-w-28 truncate text-sm font-semibold sm:block">
                  {displayName}
                </span>

                <ChevronRight
                  size={16}
                  className="hidden text-orange-500 transition-transform duration-300 group-hover:translate-x-1 sm:block"
                />
              </button>
            ) : (
              <Link
                to="/login"
                className="group flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-orange-600 hover:shadow-lg active:scale-95"
              >
                <UserRound
                  size={18}
                  className="transition-transform duration-300 group-hover:rotate-12"
                />
                Login
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setOpen(!open)}
              className="rounded-xl p-2 text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:scale-90 md:hidden"
              aria-label="Toggle navigation"
            >
              <span className="block transition-transform duration-300">
                {open ? <X size={22} /> : <Menu size={22} />}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Profile Sidebar Backdrop */}
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm transition-all duration-300 ${profileOpen && user
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
          }`}
      />

      {/* Profile Sidebar */}
      <aside
        aria-hidden={!profileOpen || !user}
        className={`fixed right-0 top-0 z-[999] flex h-dvh w-[360px] max-w-[90%] flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-500 ease-in-out ${profileOpen && user ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-red-500 p-6 text-white">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 transition-transform duration-700 hover:scale-125" />
          <div className="absolute -bottom-12 right-20 h-28 w-28 rounded-full bg-white/10" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                Welcome to
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                My Account
              </h2>
            </div>

            <button
              onClick={closeSidebar}
              className="rounded-full bg-white/15 p-2 transition-all duration-300 hover:rotate-90 hover:bg-white/30 active:scale-90"
              aria-label="Close profile sidebar"
            >
              <X size={21} />
            </button>
          </div>

          {/* User Details */}
          <div className="relative mt-7 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-white text-2xl font-extrabold text-orange-600 shadow-lg transition-transform duration-300 hover:scale-110">
              {avatarLetter}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold">
                {displayName}
              </h3>
              <p className="truncate text-sm text-white/80">
                {user?.email || "Welcome to Foodly"}
              </p>
              <span className="mt-2 inline-block rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium">
                Foodly Customer
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Your Account
          </p>

          <div className="space-y-1">
            <SidebarLink
              icon={<House size={19} />}
              label="Home"
              to="/"
              onClick={closeSidebar}
            />

            <SidebarLink
              icon={<CircleUserRound size={19} />}
              label="My Profile"
              to="/profile"
              onClick={closeSidebar}
            />

            <SidebarLink
              icon={<ClipboardList size={19} />}
              label="My Orders"
              to="/orders"
              onClick={closeSidebar}
            />

            <SidebarLink
              icon={<Heart size={19} />}
              label="My Favorites"
              to="/favorites"
              onClick={closeSidebar}
            />

            <SidebarLink
              icon={<ShoppingBag size={19} />}
              label="My Cart"
              to="/cart"
              onClick={closeSidebar}
              badge={totalItems > 0 ? totalItems : null}
            />

            <SidebarLink
              icon={<MapPin size={19} />}
              label="Restaurants"
              to="/restaurants"
              onClick={closeSidebar}
            />
            <SidebarLink
              icon={<MapPin size={19} />}
              label="Create-Restaurant"
              to="/create-restaurant"
              onClick={closeSidebar}
            />
          </div>

          <div className="my-5 border-t border-gray-100" />

          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Customer Service
          </p>

          <div className="space-y-1">
            <SidebarLink
              icon={<Headset size={19} />}
              label="Help & Support"
              to="/help"
              onClick={closeSidebar}
            />
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-100 bg-gray-50/80 p-4">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-red-500 transition-all duration-300 hover:translate-x-1 hover:bg-red-50 active:scale-[0.98]"
          >
            <LogOut
              size={19}
              className="transition-transform duration-300 group-hover:-rotate-12"
            />

            <span>Logout</span>

            <ChevronRight
              size={18}
              className="ml-auto transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            Made with ❤️ for food lovers
          </p>
        </div>
      </aside>
    </>
  );
}

/* Reusable Animated Sidebar Link */
function SidebarLink({ icon, label, to, onClick, badge }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 ease-out hover:translate-x-1 hover:bg-orange-50 hover:text-orange-600 active:scale-[0.98] ${isActive
          ? "bg-orange-50 font-semibold text-orange-600"
          : "text-gray-600"
        }`
      }
    >
      <span className="shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </span>

      <span className="flex-1 text-sm">{label}</span>

      {badge != null && (
        <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white transition-transform duration-200 group-hover:scale-110">
          {badge}
        </span>
      )}

      <ChevronRight
        size={16}
        className="text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-orange-500"
      />
    </NavLink>
  );
}
