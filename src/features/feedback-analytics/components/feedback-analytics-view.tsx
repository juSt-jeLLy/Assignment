import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Skeleton } from "@/components/dashboard/Skeleton";
import { SENTIMENT_COLORS } from "@/components/dashboard/chartTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  computeDailyTrend,
  computeDepartmentMetrics,
  computeMonthlyTrend,
  computeRatingDistribution,
  computeSentimentDistribution,
  useFeedbackRecords,
} from "@/features/feedback";
import { ExportCsvButton } from "@/features/shared/export";
import { PageHeader } from "@/features/shared/components";

/** Renders detailed feedback analytics charts and sentiment split trends. */
export function FeedbackAnalyticsView(): React.JSX.Element {
  const { data, isLoading, isError } = useFeedbackRecords();
  const isMobile = useIsMobile();

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (isError || !data)
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load feedback analytics.
      </div>
    );
  if (data.length === 0)
    return (
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        No feedback analytics available.
      </div>
    );

  const daily = computeDailyTrend(data);
  const defaultDailyStartIndex = Math.max(0, daily.length - 30);
  const monthly = computeMonthlyTrend(data);
  const ratings = computeRatingDistribution(data);
  const sentiment = computeSentimentDistribution(data);
  const byDepartment = computeDepartmentMetrics(data).map((row) => ({
    department: row.department,
    count: row.totalReviews,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Feedback Analytics"
          description="Detailed volume, ratings, and sentiment analysis over time."
        />
        <ExportCsvButton
          fileName="feedback-analytics-raw.csv"
          rows={data}
          label="Export Raw Data"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Daily Trend">
          <div className="mb-2 flex justify-end">
            <ExportCsvButton fileName="feedback-daily-trend.csv" rows={daily} />
          </div>
          <div className="flex items-stretch gap-1 sm:gap-2">
            <div className="flex w-10 shrink-0 items-center justify-center sm:w-12">
              <span className="-rotate-90 whitespace-nowrap text-sm text-muted-foreground">
                Feedback Count
              </span>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={daily} margin={{ top: 8, right: 8, left: 0, bottom: 34 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis width={isMobile ? 34 : 40} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#0369a1" strokeWidth={2} />
                  <Line type="monotone" dataKey="positive" stroke="#16a34a" />
                  <Line type="monotone" dataKey="negative" stroke="#dc2626" />
                  {daily.length > 1 && (
                    <Brush
                      dataKey="label"
                      height={20}
                      startIndex={defaultDailyStartIndex}
                      endIndex={daily.length - 1}
                      travellerWidth={12}
                      stroke="#94a3b8"
                      fill="#e2e8f0"
                      tickFormatter={() => ""}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>
        <ChartCard title="Monthly Volume">
          <div className="mb-2 flex justify-end">
            <ExportCsvButton fileName="feedback-monthly-volume.csv" rows={monthly} />
          </div>
          <div className="flex items-stretch gap-1 sm:gap-2">
            <div className="flex w-10 shrink-0 items-center justify-center sm:w-12">
              <span className="-rotate-90 whitespace-nowrap text-sm text-muted-foreground">
                Feedback Count
              </span>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthly} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    label={{ value: "Month", position: "insideBottom", offset: -2 }}
                  />
                  <YAxis width={isMobile ? 34 : 40} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0891b2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>
        <ChartCard title="Rating Distribution">
          <div className="mb-2 flex justify-end">
            <ExportCsvButton fileName="feedback-rating-distribution.csv" rows={ratings} />
          </div>
          <div className="flex items-stretch gap-1 sm:gap-2">
            <div className="flex w-10 shrink-0 items-center justify-center sm:w-12">
              <span className="-rotate-90 whitespace-nowrap text-sm text-muted-foreground">
                Feedback Count
              </span>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ratings} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="rating"
                    label={{ value: "Rating (1-5)", position: "bottom", offset: 6 }}
                  />
                  <YAxis width={isMobile ? 34 : 40} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f766e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>
        <ChartCard title="Feedback by Department">
          <div className="mb-2 flex justify-end">
            <ExportCsvButton fileName="feedback-by-department.csv" rows={byDepartment} />
          </div>
          <div className="flex items-stretch gap-1 sm:gap-2">
            <div className="flex w-10 shrink-0 items-center justify-center sm:w-12">
              <span className="-rotate-90 whitespace-nowrap text-sm text-muted-foreground">
                Feedback Count
              </span>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={byDepartment} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                  <YAxis width={isMobile ? 34 : 40} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>
        <ChartCard title="Sentiment Split">
          <div className="mb-2 flex justify-end">
            <ExportCsvButton fileName="feedback-sentiment-split.csv" rows={sentiment} />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={sentiment} dataKey="count" nameKey="sentiment" outerRadius={100}>
                {sentiment.map((entry) => (
                  <Cell key={entry.sentiment} fill={SENTIMENT_COLORS[entry.sentiment]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
