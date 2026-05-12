import { useQuery } from "@tanstack/react-query";
import { feedbackService } from "./service";

export const FEEDBACK_KEY = ["feedback"] as const;
export const DOCTORS_KEY = ["doctors"] as const;

/** Fetch the feedback dataset. */
export function useFeedback() {
  return useQuery({
    queryKey: FEEDBACK_KEY,
    queryFn: feedbackService.list,
    staleTime: 60_000,
  });
}

/** Fetch derived doctor performance rankings. */
export function useDoctors() {
  return useQuery({
    queryKey: DOCTORS_KEY,
    queryFn: feedbackService.doctors,
    staleTime: 60_000,
  });
}
