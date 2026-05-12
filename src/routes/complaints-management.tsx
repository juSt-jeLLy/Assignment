import { createFileRoute } from "@tanstack/react-router";
import { ComplaintsManagementView } from "@/features/complaints-management/components/complaints-management-view";

export const Route = createFileRoute("/complaints-management")({
  component: ComplaintsManagementView,
});
