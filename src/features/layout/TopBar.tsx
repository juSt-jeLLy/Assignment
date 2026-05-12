import { Bell, Menu, Search } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { APP_BRAND, NAV_ITEMS } from "./navConfig";
import { cn } from "@/lib/utils";

/** Top app bar with mobile drawer + theme toggle. */
export function TopBar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const current = NAV_ITEMS.find(
    (n) => n.to === pathname || (pathname === "/" && n.to === "/dashboard"),
  );
  const Brand = APP_BRAND.icon;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <button
        className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="flex flex-col">
        <h1 className="text-base font-semibold leading-tight">{current?.label ?? "Dashboard"}</h1>
        <p className="text-xs text-muted-foreground hidden sm:block">
          {current?.description ?? "Overview"}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:flex">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search feedback…"
            className="h-9 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          aria-label="Notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card hover:bg-accent transition-smooth"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse-glow" />
        </button>
        <ThemeToggle />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-sidebar p-4 lg:hidden"
            >
              <div className="flex items-center gap-3 px-2 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                  <Brand className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold">{APP_BRAND.name}</p>
                  <p className="text-[11px] text-muted-foreground">{APP_BRAND.tagline}</p>
                </div>
              </div>
              <nav className="mt-2 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.to || (pathname === "/" && item.to === "/dashboard");
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                        active
                          ? "bg-gradient-primary text-primary-foreground"
                          : "hover:bg-sidebar-accent",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
