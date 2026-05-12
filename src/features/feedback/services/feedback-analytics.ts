import type {
  ComplaintCategoryPoint,
  ComplaintStatusPoint,
  DepartmentMetric,
  DoctorPerformanceRow,
  FeedbackRecord,
  OverviewMetrics,
  OverviewMetricTrends,
  RatingDistributionPoint,
  SentimentPoint,
  StatusSummaryPoint,
  TrendPoint,
} from "@/features/feedback/types";

/** Formats an ISO date string into YYYY-MM for monthly grouping. */
export function toMonthLabel(isoDate: string): string {
  return isoDate.slice(0, 7);
}

/** Formats an ISO date string into YYYY-MM-DD for daily grouping. */
export function toDayLabel(isoDate: string): string {
  return isoDate.slice(0, 10);
}

/** Rounds a number to two decimal places. */
export function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Converts a ratio to percentage safely. */
export function toPercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return roundToTwo((part / total) * 100);
}

/** Computes percentage delta between current and previous values. */
export function percentageDelta(current: number, previous: number): number | null {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return roundToTwo(((current - previous) / previous) * 100);
}

/** Returns day difference between two ISO dates. */
export function differenceInDays(startIso: string, endIso: string): number {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
}

/** Builds overview card metrics from feedback records. */
export function computeOverviewMetrics(records: FeedbackRecord[]): OverviewMetrics {
  const totalFeedbacks = records.length;
  const averageRating = roundToTwo(
    records.reduce((sum, record) => sum + record.rating, 0) / Math.max(1, totalFeedbacks),
  );
  const positiveCount = records.filter((record) => record.sentiment === "Positive").length;
  const negativeCount = records.filter((record) => record.sentiment === "Negative").length;
  const totalComplaints = records.filter((record) => record.complaintCategory !== null).length;
  const activeDepartments = new Set(records.map((record) => record.department)).size;

  return {
    totalFeedbacks,
    averageRating,
    positivePercentage: toPercentage(positiveCount, totalFeedbacks),
    negativePercentage: toPercentage(negativeCount, totalFeedbacks),
    totalComplaints,
    activeDepartments,
  };
}

/** Aggregates records by day for trend charts. */
export function computeDailyTrend(records: FeedbackRecord[]): TrendPoint[] {
  const trendMap = new Map<string, TrendPoint>();

  records.forEach((record) => {
    const label = toDayLabel(record.date);
    const current = trendMap.get(label) ?? {
      label,
      count: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
    };
    current.count += 1;
    if (record.sentiment === "Positive") current.positive += 1;
    if (record.sentiment === "Neutral") current.neutral += 1;
    if (record.sentiment === "Negative") current.negative += 1;
    trendMap.set(label, current);
  });

  return Array.from(trendMap.values()).sort((a, b) => a.label.localeCompare(b.label));
}

/** Aggregates records by month for trend charts. */
export function computeMonthlyTrend(records: FeedbackRecord[]): TrendPoint[] {
  const trendMap = new Map<string, TrendPoint>();

  records.forEach((record) => {
    const label = toMonthLabel(record.date);
    const current = trendMap.get(label) ?? {
      label,
      count: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
    };
    current.count += 1;
    if (record.sentiment === "Positive") current.positive += 1;
    if (record.sentiment === "Neutral") current.neutral += 1;
    if (record.sentiment === "Negative") current.negative += 1;
    trendMap.set(label, current);
  });

  return Array.from(trendMap.values()).sort((a, b) => a.label.localeCompare(b.label));
}

/** Returns rating distribution from 1 to 5. */
export function computeRatingDistribution(records: FeedbackRecord[]): RatingDistributionPoint[] {
  const counts = [1, 2, 3, 4, 5].map((rating) => ({ rating, count: 0 }));
  records.forEach((record) => {
    const index = Number(record.rating) - 1;
    if (index >= 0 && index < counts.length) {
      counts[index].count += 1;
    }
  });
  return counts;
}

/** Returns sentiment split for donut charts. */
export function computeSentimentDistribution(records: FeedbackRecord[]): SentimentPoint[] {
  const sentiments = ["Positive", "Neutral", "Negative"] as const;
  return sentiments.map((sentiment) => ({
    sentiment,
    count: records.filter((record) => record.sentiment === sentiment).length,
  }));
}

/** Computes department metrics for dashboard comparisons. */
export function computeDepartmentMetrics(records: FeedbackRecord[]): DepartmentMetric[] {
  const grouped = new Map<string, FeedbackRecord[]>();
  records.forEach((record) => {
    const collection = grouped.get(record.department) ?? [];
    collection.push(record);
    grouped.set(record.department, collection);
  });

  return Array.from(grouped.entries()).map(([department, values]) => ({
    department: department as DepartmentMetric["department"],
    averageRating: roundToTwo(values.reduce((sum, entry) => sum + entry.rating, 0) / values.length),
    totalReviews: values.length,
    complaintCount: values.filter((entry) => entry.complaintCategory !== null).length,
  }));
}

/** Computes doctor table ranking metrics. */
export function computeDoctorPerformance(records: FeedbackRecord[]): DoctorPerformanceRow[] {
  const grouped = new Map<string, FeedbackRecord[]>();

  records.forEach((record) => {
    const key = `${record.department}::${record.doctor}`;
    const collection = grouped.get(key) ?? [];
    collection.push(record);
    grouped.set(key, collection);
  });

  return Array.from(grouped.values()).map((values) => {
    const first = values[0];
    const consultationRating = roundToTwo(
      values.reduce((sum, entry) => sum + entry.rating, 0) / values.length,
    );
    const complaintsReceived = values.filter((entry) => entry.complaintCategory !== null).length;
    const totalPatientsSeen = values.length * 8;

    return {
      doctor: first.doctor,
      department: first.department,
      consultationRating,
      totalPatientsSeen,
      complaintsReceived,
      overallFeedbackScore: roundToTwo(consultationRating * 20 - complaintsReceived),
    };
  });
}

/** Computes complaint category counts. */
export function computeComplaintCategoryData(records: FeedbackRecord[]): ComplaintCategoryPoint[] {
  const map = new Map<string, number>();
  records.forEach((record) => {
    if (!record.complaintCategory) return;
    map.set(record.complaintCategory, (map.get(record.complaintCategory) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([category, count]) => ({
    category: category as ComplaintCategoryPoint["category"],
    count,
  }));
}

/** Computes monthly complaint status trend for stacked chart. */
export function computeComplaintStatusTrend(records: FeedbackRecord[]): ComplaintStatusPoint[] {
  const map = new Map<string, ComplaintStatusPoint>();

  records.forEach((record) => {
    if (!record.complaintCategory) return;
    const month = toMonthLabel(record.date);
    const current = map.get(month) ?? { month, pending: 0, inProgress: 0, resolved: 0 };

    if (record.status === "Pending") current.pending += 1;
    if (record.status === "In Progress") current.inProgress += 1;
    if (record.status === "Resolved") current.resolved += 1;

    map.set(month, current);
  });

  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
}

/** Computes complaint status summary for bars. */
export function computeComplaintStatusSummary(records: FeedbackRecord[]): StatusSummaryPoint[] {
  const statuses = ["Pending", "In Progress", "Resolved"] as const;
  return statuses.map((status) => ({
    status,
    count: records.filter((record) => record.complaintCategory !== null && record.status === status)
      .length,
  }));
}

/** Computes average complaint resolution time in days. */
export function computeAverageResolutionTime(records: FeedbackRecord[]): number {
  const resolved = records.filter(
    (record) => record.complaintCategory !== null && record.resolvedAt !== null,
  );
  if (resolved.length === 0) {
    return 0;
  }

  const total = resolved.reduce(
    (sum, record) =>
      sum + differenceInDays(record.createdAt, record.resolvedAt ?? record.createdAt),
    0,
  );
  return roundToTwo(total / resolved.length);
}

/** Compares the latest period against the previous period for dashboard KPI trend badges. */
export function computeOverviewMetricTrends(
  records: FeedbackRecord[],
  period: "month" | "day" = "month",
): { trends: OverviewMetricTrends; trendLabel: string } {
  const empty = {
    totalFeedbacks: null,
    averageRating: null,
    positivePercentage: null,
    negativePercentage: null,
    totalComplaints: null,
    activeDepartments: null,
  } satisfies OverviewMetricTrends;

  if (records.length === 0) {
    return {
      trends: empty,
      trendLabel: period === "month" ? "vs previous month" : "vs previous day",
    };
  }

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const latestDate = sorted[sorted.length - 1].date.slice(0, 10);
  const currentLabel = period === "month" ? toMonthLabel(latestDate) : latestDate;

  let previousLabel: string;
  if (period === "month") {
    const [year, monthNumber] = currentLabel.split("-").map(Number);
    const previousMonthDate = new Date(year, monthNumber - 2, 1);
    previousLabel = `${previousMonthDate.getFullYear()}-${String(
      previousMonthDate.getMonth() + 1,
    ).padStart(2, "0")}`;
  } else {
    const d = new Date(`${latestDate}T00:00:00`);
    d.setDate(d.getDate() - 1);
    previousLabel = d.toISOString().slice(0, 10);
  }

  const currentPeriod = sorted.filter((record) =>
    period === "month"
      ? toMonthLabel(record.date) === currentLabel
      : toDayLabel(record.date) === currentLabel,
  );
  const previousPeriod = sorted.filter((record) =>
    period === "month"
      ? toMonthLabel(record.date) === previousLabel
      : toDayLabel(record.date) === previousLabel,
  );

  if (previousPeriod.length === 0) {
    return {
      trends: empty,
      trendLabel: period === "month" ? "vs previous month" : "vs previous day",
    };
  }

  const currentMetrics = computeOverviewMetrics(currentPeriod);
  const previousMetrics = computeOverviewMetrics(previousPeriod);

  return {
    trends: {
      totalFeedbacks: percentageDelta(
        currentMetrics.totalFeedbacks,
        previousMetrics.totalFeedbacks,
      ),
      averageRating: percentageDelta(currentMetrics.averageRating, previousMetrics.averageRating),
      positivePercentage: percentageDelta(
        currentMetrics.positivePercentage,
        previousMetrics.positivePercentage,
      ),
      negativePercentage: percentageDelta(
        currentMetrics.negativePercentage,
        previousMetrics.negativePercentage,
      ),
      totalComplaints: percentageDelta(
        currentMetrics.totalComplaints,
        previousMetrics.totalComplaints,
      ),
      activeDepartments: percentageDelta(
        currentMetrics.activeDepartments,
        previousMetrics.activeDepartments,
      ),
    },
    trendLabel: period === "month" ? "vs previous month" : "vs previous day",
  };
}
