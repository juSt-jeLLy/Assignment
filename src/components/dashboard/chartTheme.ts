/** Shared chart palette pulling from CSS design tokens. */
export const CHART_COLORS = {
  primary: "var(--chart-1)",
  success: "var(--chart-2)",
  warning: "var(--chart-3)",
  destructive: "var(--chart-4)",
  info: "var(--chart-5)",
} as const;

export const SENTIMENT_COLORS: Record<string, string> = {
  Positive: "var(--chart-2)",
  Neutral: "var(--chart-3)",
  Negative: "var(--chart-4)",
};

export const STATUS_COLORS: Record<string, string> = {
  Pending: "var(--chart-3)",
  "In Progress": "var(--chart-1)",
  Resolved: "var(--chart-2)",
};
