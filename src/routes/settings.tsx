import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, Check, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/features/theme/ThemeProvider";
import {
  useNotifyNewComplaints,
  useNotifyLowRatings,
  useNotifyWeeklyDigest,
  useNotifyMilestones,
  useSetNotifyNewComplaints,
  useSetNotifyLowRatings,
  useSetNotifyWeeklyDigest,
  useSetNotifyMilestones,
} from "@/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

interface ThemeOption {
  value: Theme;
  label: string;
  icon: typeof Sun;
  preview: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
    preview: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
    preview: "linear-gradient(135deg, #0f172a, #1e293b)",
  },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  // ── Zustand — preferences persist across navigation & page refresh ───
  const notifyNewComplaints = useNotifyNewComplaints();
  const notifyLowRatings = useNotifyLowRatings();
  const notifyWeeklyDigest = useNotifyWeeklyDigest();
  const notifyMilestones = useNotifyMilestones();
  const setNotifyNewComplaints = useSetNotifyNewComplaints();
  const setNotifyLowRatings = useSetNotifyLowRatings();
  const setNotifyWeeklyDigest = useSetNotifyWeeklyDigest();
  const setNotifyMilestones = useSetNotifyMilestones();
  // ─────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-card"
      >
        <SectionHeader
          icon={Palette}
          title="Appearance"
          description="Customize how Pulse Care looks across your device."
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {THEME_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = theme === opt.value;
            return (
              <motion.button
                key={opt.value}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "group relative overflow-hidden rounded-xl border p-4 text-left transition-smooth",
                  active
                    ? "border-primary shadow-elegant ring-2 ring-primary/30"
                    : "border-border hover:border-primary/50",
                )}
              >
                <div className="mb-3 h-24 w-full rounded-lg" style={{ background: opt.preview }} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-semibold">{opt.label}</span>
                  </div>
                  {active && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground">
            <Monitor className="h-4 w-4" />
            System theme follows your OS preference on first visit.
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-card"
      >
        <SectionHeader
          icon={Bell}
          title="Notifications"
          description="Choose what you want to be alerted about."
        />
        <div className="mt-5 space-y-3">
          <Toggle
            label="New complaint alerts"
            checked={notifyNewComplaints}
            onChange={setNotifyNewComplaints}
          />
          <Toggle
            label="Critically low ratings"
            checked={notifyLowRatings}
            onChange={setNotifyLowRatings}
          />
          <Toggle
            label="Weekly digest email"
            checked={notifyWeeklyDigest}
            onChange={setNotifyWeeklyDigest}
          />
          <Toggle
            label="Department milestone updates"
            checked={notifyMilestones}
            onChange={setNotifyMilestones}
          />
        </div>
      </motion.div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Sun;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-border p-3 text-sm cursor-pointer">
      <span>{label}</span>
      <span className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="block h-6 w-11 rounded-full bg-muted transition-smooth peer-checked:bg-gradient-primary" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-smooth peer-checked:translate-x-5" />
      </span>
    </label>
  );
}