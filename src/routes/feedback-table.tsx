import { createFileRoute } from "@tanstack/react-router";
import { FeedbackTableView } from "@/features/feedback-table/components/feedback-table-view";

export const Route = createFileRoute("/feedback-table")({
  component: FeedbackTableView,
});
