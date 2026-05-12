export type Department =
  | "Emergency"
  | "Cardiology"
  | "Neurology"
  | "Orthopedics"
  | "Pediatrics"
  | "ICU";

export type Sentiment = "Positive" | "Neutral" | "Negative";

export type FeedbackStatus = "Pending" | "In Progress" | "Resolved";

export type ComplaintCategory =
  | "Staff Behavior"
  | "Waiting Time"
  | "Billing"
  | "Cleanliness"
  | "Facilities"
  | "Treatment Quality";

export interface FeedbackRecord {
  id: number;
  patientName: string;
  department: Department;
  doctor: string;
  rating: 1 | 2 | 3 | 4 | 5;
  feedback: string;
  sentiment: Sentiment;
  date: string;
  status: FeedbackStatus;
  complaintCategory: ComplaintCategory | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface DoctorPerformanceRow {
  doctor: string;
  department: Department;
  consultationRating: number;
  totalPatientsSeen: number;
  complaintsReceived: number;
  overallFeedbackScore: number;
}

export interface OverviewMetrics {
  totalFeedbacks: number;
  averageRating: number;
  positivePercentage: number;
  negativePercentage: number;
  totalComplaints: number;
  activeDepartments: number;
}

export interface TrendPoint {
  label: string;
  count: number;
  positive: number;
  neutral: number;
  negative: number;
}

export interface OverviewMetricTrends {
  totalFeedbacks: number | null;
  averageRating: number | null;
  positivePercentage: number | null;
  negativePercentage: number | null;
  totalComplaints: number | null;
  activeDepartments: number | null;
}

export interface RatingDistributionPoint {
  rating: number;
  count: number;
}

export interface SentimentPoint {
  sentiment: Sentiment;
  count: number;
}

export interface DepartmentMetric {
  department: Department;
  averageRating: number;
  totalReviews: number;
  complaintCount: number;
}

export interface ComplaintCategoryPoint {
  category: ComplaintCategory;
  count: number;
}

export interface ComplaintStatusPoint {
  month: string;
  pending: number;
  inProgress: number;
  resolved: number;
}

export interface StatusSummaryPoint {
  status: FeedbackStatus;
  count: number;
}
