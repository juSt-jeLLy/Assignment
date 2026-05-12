import {
  Area,
  AreaChart,
  Brush,
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
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Skeleton } from "@/components/dashboard/Skeleton";
import { SENTIMENT_COLORS } from "@/components/dashboard/chartTheme";
import {
  computeDailyTrend,
  computeSentimentDistribution,
  useFeedbackRecords,
} from "@/features/feedback";
import { ExportCsvButton } from "@/features/shared/export";
import { PageHeader } from "@/features/shared/components";

/** Renders sentiment distribution and trend charts. */
export function SentimentAnalysisView(): React.JSX.Element {
  const { data, isLoading, isError } = useFeedbackRecords();

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (isError || !data)
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load sentiment analytics.
      </div>
    );

  const distribution = computeSentimentDistribution(data);
  const trend = computeDailyTrend(data);
  const defaultDailyStartIndex = Math.max(0, trend.length - 30);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Sentiment Analysis"
          description="Positive, neutral, and negative feedback distribution and trend over time."
        />
        <ExportCsvButton
          fileName="sentiment-raw-feedback.csv"
          rows={data}
          label="Export Raw Data"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Current Sentiment Distribution">
          <div className="mb-2 flex justify-end">
            <ExportCsvButton fileName="sentiment-distribution.csv" rows={distribution} />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={distribution} dataKey="count" nameKey="sentiment" outerRadius={100}>
                {distribution.map((entry) => (
                  <Cell key={entry.sentiment} fill={SENTIMENT_COLORS[entry.sentiment]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Sentiment Trend">
          <div className="mb-2 flex justify-end">
            <ExportCsvButton fileName="sentiment-trend.csv" rows={trend} />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 34 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis label={{ value: "Sentiment Count", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Area type="monotone" dataKey="positive" stroke="#22c55e" fill="#bbf7d0" />
              <Area type="monotone" dataKey="neutral" stroke="#f59e0b" fill="#fde68a" />
              <Area type="monotone" dataKey="negative" stroke="#ef4444" fill="#fecaca" />
              {trend.length > 1 && (
                <Brush
                  dataKey="label"
                  height={20}
                  startIndex={defaultDailyStartIndex}
                  endIndex={trend.length - 1}
                  travellerWidth={12}
                  stroke="#94a3b8"
                  fill="#e2e8f0"
                  tickFormatter={() => ""}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
