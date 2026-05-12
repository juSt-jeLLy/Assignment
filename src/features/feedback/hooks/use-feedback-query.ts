import { useQuery } from "@tanstack/react-query";
import { fetchFeedbackRecords } from "@/features/feedback/services";

const FEEDBACK_RECORDS_QUERY_KEY = ["feedback-records"] as const;

/** Loads feedback records through TanStack Query. */
export function useFeedbackRecords() {
  return useQuery({
    queryKey: FEEDBACK_RECORDS_QUERY_KEY,
    queryFn: fetchFeedbackRecords,
    staleTime: 5 * 60 * 1000,
  });
}
