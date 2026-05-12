import type {
  ComplaintCategory,
  ComplaintStatus,
  Department,
  DoctorPerformance,
  FeedbackRecord,
  Sentiment,
} from "./types";

const DEPARTMENTS: Department[] = [
  "Emergency",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "ICU",
];

const DOCTORS_BY_DEPT: Record<Department, string[]> = {
  Emergency: ["Dr. Patel", "Dr. Mehta", "Dr. Roy"],
  Cardiology: ["Dr. Sharma", "Dr. Khanna", "Dr. Iyer"],
  Neurology: ["Dr. Verma", "Dr. Singh"],
  Orthopedics: ["Dr. Gupta", "Dr. Banerjee"],
  Pediatrics: ["Dr. Reddy", "Dr. Joshi"],
  ICU: ["Dr. Kapoor", "Dr. Nair"],
};

const PATIENT_NAMES = [
  "Amit Kumar",
  "Priya Singh",
  "Rahul Verma",
  "Sneha Patil",
  "Vikram Rao",
  "Anjali Mehta",
  "Karan Joshi",
  "Neha Sharma",
  "Ravi Naidu",
  "Pooja Reddy",
  "Suresh Iyer",
  "Meera Pillai",
  "Arjun Das",
  "Divya Nair",
  "Manish Tiwari",
  "Kavita Bose",
  "Sandeep Yadav",
  "Ritu Agarwal",
  "Nikhil Bhatt",
  "Sonal Dixit",
  "Akash Roy",
  "Ishita Kapoor",
  "Varun Malhotra",
  "Tanya Sen",
];

const FEEDBACK_TEMPLATES: Record<Sentiment, string[]> = {
  Positive: [
    "Doctor was attentive and the treatment was effective.",
    "Excellent care and very clean facilities.",
    "Staff was kind and professional throughout my stay.",
    "Quick diagnosis and very thorough explanations.",
    "Truly impressed with the quality of service.",
  ],
  Neutral: [
    "The visit was okay, nothing exceptional.",
    "Wait time was a bit long but treatment was fine.",
    "Average experience, could improve communication.",
    "Decent facilities, staff did their job.",
  ],
  Negative: [
    "Long wait and rushed consultation. Disappointed.",
    "Billing was confusing and staff seemed uninterested.",
    "Room cleanliness needs significant improvement.",
    "Doctor did not explain the diagnosis clearly.",
    "Felt my concerns were not taken seriously.",
  ],
};

const CATEGORIES: ComplaintCategory[] = [
  "Wait Time",
  "Staff Behavior",
  "Cleanliness",
  "Billing",
  "Treatment",
  "Facilities",
];

/** Deterministic pseudo-random generator for stable mock data. */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seeded(42);
const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

function dateNDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function deriveSentiment(rating: number): Sentiment {
  if (rating >= 4) return "Positive";
  if (rating === 3) return "Neutral";
  return "Negative";
}

function deriveStatus(sentiment: Sentiment): ComplaintStatus {
  if (sentiment === "Positive") return "Resolved";
  const r = rand();
  if (r < 0.35) return "Pending";
  if (r < 0.7) return "In Progress";
  return "Resolved";
}

/** Build the canonical mock feedback dataset (~70 records across 90 days). */
function generateFeedback(): FeedbackRecord[] {
  const records: FeedbackRecord[] = [];
  const total = 75;
  for (let i = 0; i < total; i++) {
    const department = pick(DEPARTMENTS);
    const doctor = pick(DOCTORS_BY_DEPT[department]);
    const rating = Math.max(1, Math.min(5, Math.round(rand() * 4 + 1))) as FeedbackRecord["rating"];
    const sentiment = deriveSentiment(rating);
    const status = deriveStatus(sentiment);
    records.push({
      id: 101 + i,
      patientName: pick(PATIENT_NAMES),
      department,
      doctor,
      rating,
      feedback: pick(FEEDBACK_TEMPLATES[sentiment]),
      sentiment,
      date: dateNDaysAgo(Math.floor(rand() * 90)),
      status,
      category: sentiment === "Positive" ? undefined : pick(CATEGORIES),
      resolutionDays: status === "Resolved" ? Math.floor(rand() * 10) + 1 : undefined,
    });
  }
  return records.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const FEEDBACK_DATA: FeedbackRecord[] = generateFeedback();

/** Aggregate feedback into per-doctor performance metrics. */
export function buildDoctorPerformance(feedback: FeedbackRecord[]): DoctorPerformance[] {
  const map = new Map<string, DoctorPerformance>();
  let id = 1;
  for (const f of feedback) {
    const key = `${f.doctor}__${f.department}`;
    const existing = map.get(key);
    if (existing) {
      existing.consultationRating =
        (existing.consultationRating * existing.patientsSeen + f.rating) /
        (existing.patientsSeen + 1);
      existing.patientsSeen += 1;
      if (f.sentiment === "Negative") existing.complaintsReceived += 1;
    } else {
      map.set(key, {
        id: id++,
        name: f.doctor,
        department: f.department,
        consultationRating: f.rating,
        patientsSeen: 1,
        complaintsReceived: f.sentiment === "Negative" ? 1 : 0,
        feedbackScore: 0,
      });
    }
  }
  const arr = Array.from(map.values()).map((d) => ({
    ...d,
    consultationRating: Number(d.consultationRating.toFixed(2)),
    feedbackScore: Number(
      (
        d.consultationRating * 18 -
        (d.complaintsReceived / Math.max(d.patientsSeen, 1)) * 20
      ).toFixed(1),
    ),
  }));
  return arr.sort((a, b) => b.feedbackScore - a.feedbackScore);
}

export const DOCTOR_PERFORMANCE: DoctorPerformance[] = buildDoctorPerformance(FEEDBACK_DATA);
