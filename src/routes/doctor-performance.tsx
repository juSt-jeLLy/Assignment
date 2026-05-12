import { createFileRoute } from "@tanstack/react-router";
import { DoctorPerformanceView } from "@/features/doctor-performance/components/doctor-performance-view";

export const Route = createFileRoute("/doctor-performance")({
  component: DoctorPerformanceView,
});
