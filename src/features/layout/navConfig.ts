import {
  Activity,
  BarChart3,
  LayoutDashboard,
  MessageSquareWarning,
  Settings,
  Stethoscope,
  Table2,
  TrendingUp,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    description: "High-level overview",
  },
  {
    label: "Feedback Analytics",
    to: "/feedback-analytics",
    icon: BarChart3,
    description: "Volume and ratings analysis",
  },
  {
    label: "Sentiment Analysis",
    to: "/sentiment-analysis",
    icon: TrendingUp,
    description: "Sentiment distribution and trend",
  },
  {
    label: "Doctor Performance",
    to: "/doctor-performance",
    icon: Stethoscope,
    description: "Doctor rankings and outcomes",
  },
  {
    label: "Complaints Management",
    to: "/complaints-management",
    icon: MessageSquareWarning,
    description: "Complaint tracking and status",
  },
  {
    label: "Feedback Table",
    to: "/feedback-table",
    icon: Table2,
    description: "Detailed records with filters",
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
    description: "Preferences and theme",
  },
];

export const APP_BRAND = {
  name: "Hospital Feedback",
  tagline: "Patient Experience Analytics",
  icon: Activity,
};
