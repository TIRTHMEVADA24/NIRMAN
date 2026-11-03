import { Link, useLocation } from "react-router-dom";
import { Bell, ChevronDown, Menu, X, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export function getHomePath(user: { role?: string } | null | undefined): string {
  if (!user) return "/";
  if (user.role === "MANUFACTURER") return "/mfr/dashboard";
  if (user.role === "ADMIN") return "/admin";
  return "/dashboard";
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const { user, logout } = useAuth();
  const homePath = getHomePath(user);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Find Manufacturers", to: "/manufacturers" },
    { label: "Browse Products", to: "/discover" },
    { label: "Categories", to: "/categories" },
    { label: "How it Works", to: "/how-it-works" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-sm py-2"
          : "bg-white border-b border-border py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link to={homePath} className="flex items-center gap-2.5 shrink-0 group" title="Nirmaan Home">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm group-hover:shadow-brand transition-all duration-300">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-display font-extrabold text-ink text-xl tracking-tight">
            Nirmaan<span className="text-brand-500">.</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => {
            const isActive = loc.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors group"
              >
                <span className={`relative z-10 ${isActive ? "text-brand-600" : "text-ink-2 group-hover:text-ink"}`}>
                  {l.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-brand-50 rounded-lg z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-muted opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200 z-0" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to={homePath}>
                <Button variant="primary" size="sm" className="shadow-brand">
                  <LayoutDashboard size={14} className="mr-1.5" /> Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 font-bold hidden sm:inline-flex items-center gap-1.5"
              >
                <LogOut size={15} /> Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="font-bold">Log in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="shadow-brand">Get Started</Button>
              </Link>
            </>
          )}
          <button
            className="lg:hidden p-2 text-ink-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-white overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    loc.pathname === l.to ? "bg-brand-50 text-brand-600" : "text-ink-2 hover:bg-muted"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              {user ? (
                <>
                  <Link
                    to={homePath}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-bold text-brand-600 hover:bg-brand-50 flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 text-left"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-bold text-ink-2 hover:bg-muted"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-bold text-brand-600 hover:bg-brand-50"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function DashboardNavbar({ userType = "buyer" }: { userType?: "buyer" | "manufacturer" | "admin" }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const homePath = getHomePath(user);
  const settingsPath = user?.role === "MANUFACTURER" ? "/mfr/settings" : user?.role === "ADMIN" ? "/admin/settings" : "/settings";
  const displayName = user?.name || user?.companyName || (userType === "buyer" ? "My Account" : userType === "manufacturer" ? "Manufacturer" : "Admin");
  const initials = displayName.substring(0, 2).toUpperCase();
  const displayRole = user?.role || userType.toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-border flex items-center px-6 gap-4 sticky top-0 z-40">
      <Link to={homePath} className="flex items-center gap-2.5 shrink-0 group" title="Go to Dashboard">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm group-hover:shadow-brand transition-all duration-300">
          <span className="text-white font-bold text-xs">N</span>
        </div>
        <span className="font-display font-bold text-ink text-lg hidden sm:block tracking-tight">
          Nirmaan<span className="text-brand-500">.</span>
        </span>
      </Link>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <Link
          to="/notifications"
          className="w-9 h-9 rounded-full hover:bg-surface flex items-center justify-center text-ink-3 relative transition-colors"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-500 border-2 border-white rounded-full" />
        </Link>

        {/* User Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-surface border border-transparent hover:border-border transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 border border-brand-300 flex items-center justify-center text-brand-700 text-xs font-bold shadow-sm">
              {initials}
            </div>
            <span className="text-sm font-bold text-ink hidden sm:block max-w-[130px] truncate text-left">
              {displayName}
            </span>
            <ChevronDown size={14} className={`text-ink-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-border py-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border bg-surface/40">
                  <p className="text-sm font-bold text-ink truncate">{displayName}</p>
                  {user?.email && <p className="text-xs text-ink-3 truncate mt-0.5">{user.email}</p>}
                  <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                    {displayRole}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to={homePath}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-ink-2 hover:bg-surface hover:text-ink transition-colors"
                  >
                    <LayoutDashboard size={16} className="text-ink-3" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to={settingsPath}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-ink-2 hover:bg-surface hover:text-ink transition-colors"
                  >
                    <Settings size={16} className="text-ink-3" />
                    <span>Settings</span>
                  </Link>
                </div>

                <div className="border-t border-border pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut size={16} className="text-red-600" />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
