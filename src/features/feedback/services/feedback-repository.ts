import rawFeedbackRecords from "@/features/feedback/data/feedback-records.json";
import type { FeedbackRecord } from "@/features/feedback/types";

/** Returns all feedback records from the JSON data source. */
export async function getFeedbackRecords(): Promise<FeedbackRecord[]> {
  return rawFeedbackRecords as FeedbackRecord[];
}
