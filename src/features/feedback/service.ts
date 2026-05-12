import { FEEDBACK_DATA, DOCTOR_PERFORMANCE } from "./mockData";
import type {
  ComplaintCategory,
  ComplaintStatus,
  Department,
  DoctorPerformance,
  FeedbackRecord,
  Sentiment,
} from "./types";

/** Simulate network latency for a more realistic data layer. */
const delay = <T>(value: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const feedbackService = {
  list: () => delay(FEEDBACK_DATA),
  doctors: () => delay(DOCTOR_PERFORMANCE),
};

export interface OverviewStats {
  totalFeedbacks: number;
  averageRating: number;
  positivePct: number;
  negativePct: number;
  totalComplaints: number;
  activeDepartments: number;
  trends: {
    feedbacks: number;
    rating: number;
    positive: number;
    negative: number;
    complaints: number;
  };
}

export function computeOverview(records: FeedbackRecord[]): OverviewStats {
  const total = records.length || 1;
  const avg = records.reduce((s, r) => s + r.rating, 0) / total;
  const positive = records.filter((r) => r.sentiment === "Positive").length;
  const negative = records.filter((r) => r.sentiment === "Negative").length;
  const complaints = records.filter((r) => r.sentiment !== "Positive").length;
  const departments = new Set(records.map((r) => r.department)).size;
  return {
    totalFeedbacks: records.length,
    averageRating: Number(avg.toFixed(2)),
    positivePct: Math.round((positive / total) * 100),
    negativePct: Math.round((negative / total) * 100),
    totalComplaints: complaints,
    activeDepartments: departments,
    trends: {
      feedbacks: 12.4,
      rating: 3.1,
      positive: 5.6,
      negative: -2.4,
      complaints: -8.2,
    },
  };
}

export interface TrendPoint {
  date: string;
  count: number;
  positive: number;
  negative: number;
  neutral: number;
}

export function computeDailyTrend(records: FeedbackRecord[]): TrendPoint[] {
  const map = new Map<string, TrendPoint>();
  for (const r of records) {
    const cur = map.get(r.date) ?? {
      date: r.date,
      count: 0,
      positive: 0,
      negative: 0,
      neutral: 0,
    };
    cur.count += 1;
    if (r.sentiment === "Positive") cur.positive += 1;
    else if (r.sentiment === "Negative") cur.negative += 1;
    else cur.neutral += 1;
    map.set(r.date, cur);
  }
  return Array.from(map.values()).sort((a, b) => (a.date < b.date ? -1 : 1));
}

export interface RatingBucket {
  rating: string;
  count: number;
}

export function computeRatingDistribution(records: FeedbackRecord[]): RatingBucket[] {
  const counts = [0, 0, 0, 0, 0];
  records.forEach((r) => {
    counts[r.rating - 1] += 1;
  });
  return counts.map((c, i) => ({ rating: `${i + 1}★`, count: c }));
}

export interface SentimentSlice {
  name: Sentiment;
  value: number;
}

export function computeSentimentSplit(records: FeedbackRecord[]): SentimentSlice[] {
  const map: Record<Sentiment, number> = {
    Positive: 0,
    Neutral: 0,
    Negative: 0,
  };
  records.forEach((r) => (map[r.sentiment] += 1));
  return [
    { name: "Positive", value: map.Positive },
    { name: "Neutral", value: map.Neutral },
    { name: "Negative", value: map.Negative },
  ];
}

export interface DepartmentMetric {
  department: Department;
  averageRating: number;
  totalReviews: number;
  complaints: number;
}

export function computeDepartmentMetrics(records: FeedbackRecord[]): DepartmentMetric[] {
  const map = new Map<Department, DepartmentMetric>();
  for (const r of records) {
    const cur = map.get(r.department) ?? {
      department: r.department,
      averageRating: 0,
      totalReviews: 0,
      complaints: 0,
    };
    cur.averageRating = (cur.averageRating * cur.totalReviews + r.rating) / (cur.totalReviews + 1);
    cur.totalReviews += 1;
    if (r.sentiment === "Negative") cur.complaints += 1;
    map.set(r.department, cur);
  }
  return Array.from(map.values())
    .map((d) => ({ ...d, averageRating: Number(d.averageRating.toFixed(2)) }))
    .sort((a, b) => b.averageRating - a.averageRating);
}

export interface CategoryBucket {
  category: ComplaintCategory;
  count: number;
}

export function computeComplaintsByCategory(records: FeedbackRecord[]): CategoryBucket[] {
  const map = new Map<ComplaintCategory, number>();
  records
    .filter((r) => r.category)
    .forEach((r) => map.set(r.category!, (map.get(r.category!) ?? 0) + 1));
  return Array.from(map.entries()).map(([category, count]) => ({
    category,
    count,
  }));
}

export interface StatusOverTime {
  month: string;
  Pending: number;
  "In Progress": number;
  Resolved: number;
}

export function computeStatusOverTime(records: FeedbackRecord[]): StatusOverTime[] {
  const map = new Map<string, StatusOverTime>();
  for (const r of records.filter((x) => x.sentiment !== "Positive")) {
    const month = r.date.slice(0, 7);
    const cur = map.get(month) ?? {
      month,
      Pending: 0,
      "In Progress": 0,
      Resolved: 0,
    };
    cur[r.status as ComplaintStatus] += 1;
    map.set(month, cur);
  }
  return Array.from(map.values()).sort((a, b) => (a.month < b.month ? -1 : 1));
}

export function computeAvgResolutionDays(records: FeedbackRecord[]): number {
  const resolved = records.filter((r) => r.status === "Resolved" && r.resolutionDays != null);
  if (resolved.length === 0) return 0;
  const sum = resolved.reduce((s, r) => s + (r.resolutionDays ?? 0), 0);
  return Number((sum / resolved.length).toFixed(1));
}

export type { FeedbackRecord, DoctorPerformance };
