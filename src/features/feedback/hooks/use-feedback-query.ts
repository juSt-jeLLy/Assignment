import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { fetchFeedbackRecords } from "@/features/feedback/services";

const QUERY_KEY = ["feedback-records"] as const;

export function useFeedbackRecords() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("feedback_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "feedback_records",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchFeedbackRecords,
    staleTime: 5 * 60 * 1000,
  });
}
