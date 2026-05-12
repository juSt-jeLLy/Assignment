import { supabase } from "@/lib/supabase";
import type { FeedbackRecord } from "@/features/feedback/types";

export async function getFeedbackRecords(): Promise<FeedbackRecord[]> {
  const { data, error } = await supabase
    .from("feedback_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data.map((row) => ({
    id: row.id,
    patientName: row.patient_name,
    department: row.department,
    doctor: row.doctor,
    rating: row.rating,
    feedback: row.feedback,
    sentiment: row.sentiment,
    date: row.date,
    status: row.status,
    complaintCategory: row.complaint_category,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
  }));
}