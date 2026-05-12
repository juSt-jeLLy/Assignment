import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, CircleAlert, MessageSquare, Smile, Star, ThumbsDown } from "lucide-react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/dashboard/Skeleton";
import {
  useFeedbackRecords,
  computeDailyTrend,
  computeDepartmentMetrics,
  computeOverviewMetricTrends,
  computeOverviewMetrics,
} from "@/features/feedback";
import { ExportCsvButton } from "@/features/shared/export";
import { PageHeader } from "@/features/shared/components";

/** Renders dashboard overview cards and top-level trend charts. */
export function DashboardView(): React.JSX.Element {
  const { data, isLoading, isError } = useFeedbackRecords();

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (isError || !data)
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load dashboard metrics.
      </div>
    );
  if (data.length === 0)
    return (
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        No feedback records available.
      </div>
    );

  const metrics = computeOverviewMetrics(data);
  const { trends: metricTrends, trendLabel } = computeOverviewMetricTrends(data, "month");
  const trend = computeDailyTrend(data);
  const departments = computeDepartmentMetrics(data);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Dashboard"
          description="High-level hospital feedback overview and recent activity trends."
        />
        <ExportCsvButton
          fileName="dashboard-raw-feedback.csv"
          rows={data}
          label="Export Raw Data"
        />
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Feedbacks"
          value={`${metrics.totalFeedbacks}`}
          icon={MessageSquare}
          trend={metricTrends.totalFeedbacks}
          trendLabel={trendLabel}
        />
        <StatCard
          label="Average Rating"
          value={`${metrics.averageRating}/5`}
          icon={Star}
          trend={metricTrends.averageRating}
          trendLabel={trendLabel}
        />
        <StatCard
          label="Positive Feedback"
          value={`${metrics.positivePercentage}%`}
          icon={Smile}
          trend={metricTrends.positivePercentage}
          trendLabel={trendLabel}
        />
        <StatCard
          label="Negative Feedback"
          value={`${metrics.negativePercentage}%`}
          icon={ThumbsDown}
          trend={metricTrends.negativePercentage}
          trendLabel={trendLabel}
        />
        <StatCard
          label="Total Complaints"
          value={`${metrics.totalComplaints}`}
          icon={CircleAlert}
          trend={metricTrends.totalComplaints}
          trendLabel={trendLabel}
        />
        <StatCard
          label="Active Departments"
          value={`${metrics.activeDepartments}`}
          icon={Building2}
          trend={metricTrends.activeDepartments}
          trendLabel={trendLabel}
        />
      </section>

      <ChartCard title="Daily Feedback Volume" description="Daily feedback count trend">
        <div className="mb-2 flex justify-end">
          <ExportCsvButton fileName="dashboard-daily-trend.csv" rows={trend} />
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              label={{ value: "Date", position: "insideBottom", offset: -2 }}
            />
            <YAxis label={{ value: "Feedback Count", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#0891b2" fill="#a5f3fc" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Department Performance"
        description="Reviews, complaints, and average rating by department"
      >
        <div className="mb-2 flex justify-end">
          <ExportCsvButton fileName="dashboard-department-performance.csv" rows={departments} />
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart
            data={departments}
            layout="vertical"
            margin={{ top: 8, right: 20, left: 88, bottom: 24 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              label={{ value: "Count / Rating", position: "bottom", offset: 6 }}
            />
            <YAxis type="category" dataKey="department" width={148} />
            <Tooltip />
            <Bar dataKey="totalReviews" fill="#0ea5e9" name="Total Reviews" />
            <Bar dataKey="complaintCount" fill="#f97316" name="Complaint Count" />
            <Line
              dataKey="averageRating"
              stroke="#0f766e"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Avg Rating"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
