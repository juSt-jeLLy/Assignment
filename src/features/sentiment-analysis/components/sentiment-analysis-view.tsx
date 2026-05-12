import {
  Area,
  AreaChart,
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
            <AreaChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                label={{ value: "Date", position: "insideBottom", offset: -2 }}
              />
              <YAxis label={{ value: "Sentiment Count", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Area type="monotone" dataKey="positive" stroke="#22c55e" fill="#bbf7d0" />
              <Area type="monotone" dataKey="neutral" stroke="#f59e0b" fill="#fde68a" />
              <Area type="monotone" dataKey="negative" stroke="#ef4444" fill="#fecaca" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
