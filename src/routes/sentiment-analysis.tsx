import { createFileRoute } from "@tanstack/react-router";
import { SentimentAnalysisView } from "@/features/sentiment-analysis/components/sentiment-analysis-view";

export const Route = createFileRoute("/sentiment-analysis")({
  component: SentimentAnalysisView,
});
