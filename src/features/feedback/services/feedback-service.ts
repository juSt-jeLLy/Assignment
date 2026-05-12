import type { FeedbackRecord } from "@/features/feedback/types";
import { getFeedbackRecords } from "./feedback-repository";

/** Fetches and returns all feedback records for analytics pages. */
export async function fetchFeedbackRecords(): Promise<FeedbackRecord[]> {
  const records = await getFeedbackRecords();
  return records;
}
