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
}

export interface User {
  id: string;
  name: string;
}

export const currentUser: User = {
  id: "u1",
  name: "Braden Long",
};

export const initialApplications: Application[] = [
  {
    id: "app-1",
    company_name: "Google",
    job_title: "Software Engineer II",
    status: "Interviewing",
    date_applied: "2026-01-15",
    salary_expectation: 165000,
    job_url: "https://careers.google.com/jobs/1234",
    notes: "Recruiter reached out on LinkedIn. Phone screen scheduled for Feb 3.",
    tags: ["Hybrid", "React", "Go"],
  },
  {
    id: "app-2",
    company_name: "Stripe",
    job_title: "Full Stack Engineer",
    status: "Applied",
    date_applied: "2026-01-20",
    salary_expectation: 175000,
    job_url: "https://stripe.com/jobs/5678",
    notes: "Referred by a friend on the payments team.",
    tags: ["Remote", "Ruby", "React"],
  },
  {
    id: "app-3",
    company_name: "Capital One",
    job_title: "Associate Software Engineer",
    status: "Offer",
    date_applied: "2025-12-10",
    salary_expectation: 120000,
    job_url: "https://capitalone.com/careers/9012",
    notes: "Offer received $118k + signing bonus. Deadline Feb 15.",
    tags: ["Hybrid", "Java", "AWS"],
  },
  {
    id: "app-4",
    company_name: "Meta",
    job_title: "Frontend Engineer",
    status: "Rejected",
    date_applied: "2025-12-20",
    salary_expectation: 170000,
    job_url: "https://metacareers.com/jobs/3456",
    notes: "Rejected after final round. Feedback: needed more system design depth.",
    tags: ["On-site", "React", "GraphQL"],
  },
  {
    id: "app-5",
    company_name: "Notion",
    job_title: "Product Engineer",
    status: "Applied",
    date_applied: "2026-01-22",
    salary_expectation: 155000,
    job_url: "https://notion.so/careers/7890",
    notes: "Applied via website. Love the product.",
    tags: ["Remote", "TypeScript", "Postgres"],
  },
  {
    id: "app-6",
    company_name: "Vercel",
    job_title: "Software Engineer, DX",
    status: "Saved",
    date_applied: "2026-01-28",
    salary_expectation: 160000,
    job_url: "https://vercel.com/careers/1111",
    notes: "Want to apply next week after polishing portfolio.",
    tags: ["Remote", "Next.js", "TypeScript"],
  },
  {
    id: "app-7",
    company_name: "Palantir",
    job_title: "Forward Deployed Engineer",
    status: "Interviewing",
    date_applied: "2026-01-10",
    salary_expectation: 150000,
    job_url: "https://palantir.com/careers/2222",
    notes: "Completed HackerRank. On-site next week in NYC.",
    tags: ["On-site", "Java", "Python"],
  },
  {
    id: "app-8",
    company_name: "Datadog",
    job_title: "Backend Engineer",
    status: "Applied",
    date_applied: "2026-01-25",
    salary_expectation: 160000,
    job_url: "https://datadog.com/careers/3333",
    notes: "Applied through university career portal.",
    tags: ["Hybrid", "Go", "Kubernetes"],
  },
  {
    id: "app-9",
    company_name: "Figma",
    job_title: "Product Designer & Engineer",
    status: "Saved",
    date_applied: "2026-01-29",
    salary_expectation: 145000,
    job_url: "https://figma.com/careers/4444",
    notes: "Posting looks perfect. Need to tailor resume.",
    tags: ["Remote", "TypeScript", "C++"],
  },
  {
    id: "app-10",
    company_name: "Robinhood",
    job_title: "iOS Engineer",
    status: "Rejected",
    date_applied: "2025-11-30",
    salary_expectation: 155000,
    job_url: "https://robinhood.com/careers/5555",
    notes: "Auto-rejected. Likely ATS filter.",
    tags: ["Hybrid", "Swift", "Kotlin"],
  },
  {
    id: "app-11",
    company_name: "Airbnb",
    job_title: "Software Engineer, Payments",
    status: "Applied",
    date_applied: "2026-01-27",
    salary_expectation: 170000,
    job_url: "https://airbnb.com/careers/6666",
    notes: "Strong referral from college friend.",
    tags: ["Hybrid", "Java", "React"],
  },
  {
    id: "app-12",
    company_name: "Coinbase",
    job_title: "Backend Engineer",
    status: "Saved",
    date_applied: "2026-01-30",
    salary_expectation: 165000,
    job_url: "https://coinbase.com/careers/7777",
    notes: "Interesting role in the staking team.",
    tags: ["Remote", "Go", "Postgres"],
  },
  {
    id: "app-13",
    company_name: "Microsoft",
    job_title: "SDE New Grad",
    status: "Interviewing",
    date_applied: "2026-01-05",
    salary_expectation: 135000,
    job_url: "https://careers.microsoft.com/8888",
    notes: "Final loop scheduled for Feb 10. Studying system design.",
    tags: ["On-site", "C#", "Azure"],
  },
];

export const STATUSES: Status[] = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

export const STATUS_COLORS: Record<Status, string> = {
  Saved: "bg-zinc-500/20 text-zinc-400",
  Applied: "bg-blue-500/20 text-blue-400",
  Interviewing: "bg-amber-500/20 text-amber-400",
  Offer: "bg-emerald-500/20 text-emerald-400",
  Rejected: "bg-red-500/20 text-red-400",
};
