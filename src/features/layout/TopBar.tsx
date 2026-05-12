import { Bell, Menu, Search } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { APP_BRAND, NAV_ITEMS } from "./navConfig";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/features/notifications/use-notifications";
import type { Notification } from "@/features/notifications/types";
import {
  useMobileDrawerOpen,
  useSetMobileDrawerOpen,
  useNotificationPanelOpen,
  useSetNotificationPanelOpen,
  useGlobalSearch,
  useSetGlobalSearch,
} from "@/store";

export function TopBar() {
  const { pathname } = useLocation();
  const notifRef = useRef<HTMLDivElement>(null);

  // ── Zustand ──────────────────────────────────────────────────────────
  const mobileDrawerOpen = useMobileDrawerOpen();
  const setMobileDrawerOpen = useSetMobileDrawerOpen();
  const notificationPanelOpen = useNotificationPanelOpen();
  const setNotificationPanelOpen = useSetNotificationPanelOpen();
  const globalSearch = useGlobalSearch();
  const setGlobalSearch = useSetGlobalSearch();
  // ─────────────────────────────────────────────────────────────────────

  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();

  const current = NAV_ITEMS.find(
    (n) => n.to === pathname || (pathname === "/" && n.to === "/dashboard"),
  );
  const Brand = APP_BRAND.icon;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setNotificationPanelOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur-md sm:px-6">
      <button
        className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border"
        onClick={() => setMobileDrawerOpen(true)}
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
        {/* Global search — value lives in Zustand so FeedbackTable can read it */}
        <div className="relative hidden md:flex">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search feedback…"
            className="h-9 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            aria-label="Notifications"
            onClick={() => {
              setNotificationPanelOpen(!notificationPanelOpen);
              if (!notificationPanelOpen && unreadCount > 0) markAllRead();
            }}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card hover:bg-accent transition-smooth"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white animate-pulse-glow">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notificationPanelOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="fixed left-1/2 top-20 z-50 w-[min(22rem,calc(100vw-1.5rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-elegant sm:absolute sm:left-auto sm:right-0 sm:top-11 sm:w-80 sm:translate-x-0"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold">Notifications</p>
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-sm text-muted-foreground">
                      <Bell className="h-8 w-8 mb-2 opacity-30" />
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <NotificationItem
                        key={n.id}
                        notification={n}
                        onRead={() => markOneRead(n.id)}
                      />
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ThemeToggle />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-3 top-3 z-50 isolate w-72 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-border p-4 shadow-elegant lg:hidden"
            >
              <div className="absolute inset-0 bg-sidebar" aria-hidden="true" />
              <div className="relative z-10">
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
                        onClick={() => setMobileDrawerOpen(false)}
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
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: () => void;
}) {
  return (
    <div
      onClick={onRead}
      className={cn(
        "flex gap-3 px-4 py-3 cursor-pointer hover:bg-accent/50 transition-smooth border-b border-border/50 last:border-0",
        !notification.read && "bg-primary/5",
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm",
          notification.type === "complaint"
            ? "bg-destructive/15 text-destructive"
            : "bg-success/15 text-success",
        )}
      >
        {notification.type === "complaint" ? "⚠️" : "✓"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{notification.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
      {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
    </div>
  );
}
