import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle2, Clock3, MessageSquareWarning } from "lucide-react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/dashboard/Skeleton";
import {
  computeAverageResolutionTime,
  computeComplaintCategoryData,
  computeComplaintStatusSummary,
  computeComplaintStatusTrend,
  useFeedbackRecords,
} from "@/features/feedback";
import { ExportCsvButton } from "@/features/shared/export";
import { PageHeader } from "@/features/shared/components";

const palette = ["#e11d48", "#22c55e", "#4f46e5", "#f59e0b", "#0ea5e9", "#f97316"];

/** Renders complaint KPIs and complaint-focused charts. */
export function ComplaintsManagementView(): React.JSX.Element {
  const { data, isLoading, isError } = useFeedbackRecords();

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (isError || !data)
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load complaints analytics.
      </div>
    );

  const complaintRecords = data.filter((entry) => entry.complaintCategory !== null);
  const categories = computeComplaintCategoryData(data);
  const statusTrend = computeComplaintStatusTrend(data);
  const statusSummary = computeComplaintStatusSummary(data);
  const averageResolution = computeAverageResolutionTime(data);
  const resolvedCount = complaintRecords.filter((entry) => entry.status === "Resolved").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Complaints Management"
          description="Track complaint categories, status progression, and resolution speed."
        />
        <ExportCsvButton
          fileName="complaints-raw.csv"
          rows={complaintRecords}
          label="Export Complaints CSV"
        />
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Total Complaints"
          value={`${complaintRecords.length}`}
          icon={MessageSquareWarning}
          accent="destructive"
        />
        <StatCard
          label="Average Resolution Time"
          value={`${averageResolution} days`}
          icon={Clock3}
          accent="warning"
        />
        <StatCard
          label="Resolved Complaints"
          value={`${resolvedCount}`}
          icon={CheckCircle2}
          accent="success"
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Complaints by Category">
          <div className="mb-2 flex justify-end">
            <ExportCsvButton fileName="complaints-by-category.csv" rows={categories} />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categories} dataKey="count" nameKey="category" outerRadius={100}>
                {categories.map((entry, index) => (
                  <Cell key={entry.category} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Status Distribution">
          <div className="mb-2 flex justify-end">
            <ExportCsvButton fileName="complaint-status-summary.csv" rows={statusSummary} />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusSummary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="status"
                label={{ value: "Resolution Status", position: "insideBottom", offset: -2 }}
              />
              <YAxis label={{ value: "Complaint Count", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0284c7" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Month-over-Month Complaint Status Trend">
        <div className="mb-2 flex justify-end">
          <ExportCsvButton fileName="complaint-status-trend.csv" rows={statusTrend} />
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={statusTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              label={{ value: "Month", position: "insideBottom", offset: -2 }}
            />
            <YAxis label={{ value: "Complaint Count", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="pending" stackId="status" fill="#f97316" />
            <Bar dataKey="inProgress" stackId="status" fill="#eab308" />
            <Bar dataKey="resolved" stackId="status" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
