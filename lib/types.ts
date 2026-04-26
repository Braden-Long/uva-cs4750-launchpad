export type Status = "Saved" | "Applied" | "Interviewing" | "Offer" | "Rejected";

export interface Application {
  id: string;
  company_name: string;
  job_title: string;
  status: Status;
  date_applied: string;
  salary_expectation: number;
  job_url: string;
  notes: string;
  tags: string[];
  job_type?: "Internship" | "Full-time" | null;
  duration_months?: number | null;
  equity_offered?: string | null;
  sign_on_bonus?: number | null;
  documents?: { document_id: number; title: string; doc_type: string }[];
  newDocuments?: { title: string; doc_type: string }[];
  deletedDocIds?: number[];
}

export const STATUSES: Status[] = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

export const STATUS_COLORS: Record<Status, string> = {
  Saved: "bg-zinc-500/20 text-zinc-400",
  Applied: "bg-blue-500/20 text-blue-400",
  Interviewing: "bg-amber-500/20 text-amber-400",
  Offer: "bg-emerald-500/20 text-emerald-400",
  Rejected: "bg-red-500/20 text-red-400",
};
