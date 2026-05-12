import { createFileRoute } from "@tanstack/react-router";
import { FeedbackAnalyticsView } from "@/features/feedback-analytics/components/feedback-analytics-view";

export const Route = createFileRoute("/feedback-analytics")({
  component: FeedbackAnalyticsView,
});
