import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

function toFrontendStatus(status: string): string {
  return status === "Offered" ? "Offer" : status;
}

function toDate(val: unknown): string {
  if (!val) return new Date().toISOString().split("T")[0];
  if (val instanceof Date) return val.toISOString().split("T")[0];
  return String(val).split("T")[0];
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [rows] = await db.query(
    `SELECT a.app_number, a.company_name, a.job_title, a.app_date, a.status, a.salary, a.notes,
       GROUP_CONCAT(DISTINCT at.tags ORDER BY at.tags SEPARATOR ',') AS tags,
       i.duration_months,
       f.equity_offered, f.sign_on_bonus,
       GROUP_CONCAT(DISTINCT CONCAT(d.title, ':::', d.doc_type) ORDER BY d.document_id SEPARATOR '|') AS documents
     FROM application a
     LEFT JOIN application_tags at ON a.username = at.username AND a.app_number = at.app_number
     LEFT JOIN internship i ON a.username = i.username AND a.app_number = i.app_number
     LEFT JOIN full_time f ON a.username = f.username AND a.app_number = f.app_number
     LEFT JOIN submitted_with sw ON a.username = sw.username AND a.app_number = sw.app_number
     LEFT JOIN document d ON sw.document_id = d.document_id
     WHERE a.username = ?
     GROUP BY a.app_number, a.company_name, a.job_title, a.app_date, a.status, a.salary, a.notes,
              i.duration_months, f.equity_offered, f.sign_on_bonus
     ORDER BY a.app_date DESC`,
    [session.username]
  ) as any[];

  const applications = (rows as any[]).map((row) => ({
    id: String(row.app_number),
    company_name: row.company_name ?? "",
    job_title: row.job_title ?? "",
    status: toFrontendStatus(row.status ?? "Saved"),
    date_applied: toDate(row.app_date),
    salary_expectation: Number(row.salary) || 0,
    job_url: "",
    notes: row.notes ?? "",
    tags: row.tags ? row.tags.split(",") : [],
    job_type: row.duration_months != null ? "Internship" : row.equity_offered != null ? "Full-time" : null,
    duration_months: row.duration_months != null ? Number(row.duration_months) : null,
    equity_offered: row.equity_offered ?? null,
    sign_on_bonus: row.sign_on_bonus != null ? Number(row.sign_on_bonus) : null,
    documents: row.documents
      ? row.documents.split("|").map((d: string) => {
          const [title, doc_type] = d.split(":::");
          return { title: title ?? "", doc_type: doc_type ?? "" };
        })
      : [],
  }));

  return NextResponse.json(applications);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { company_name, job_title, status, date_applied, salary_expectation, notes, tags,
          job_type, duration_months, equity_offered, sign_on_bonus } =
    await req.json();

  // Next app_number for this user
  const [numRows] = await db.query(
    "SELECT COALESCE(MAX(app_number), 0) + 1 AS next_num FROM application WHERE username = ?",
    [session.username]
  ) as any[];
  const next_num = (numRows as any[])[0].next_num;

  await db.query("INSERT IGNORE INTO company (company_name) VALUES (?)", [company_name]);

  await db.query(
    `INSERT INTO application (username, app_number, company_name, job_title, app_date, status, salary, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      session.username,
      next_num,
      company_name,
      job_title,
      (status === "Saved") ? null : (date_applied || new Date().toISOString().split("T")[0]),
      status || "Saved",
      salary_expectation || null,
      notes || null,
    ]
  );

  if (tags && tags.length > 0) {
    for (const tag of tags as string[]) {
      await db.query(
        "INSERT IGNORE INTO application_tags (username, app_number, tags) VALUES (?, ?, ?)",
        [session.username, next_num, tag]
      );
    }
  }

  if (job_type === "Internship") {
    await db.query(
      "INSERT IGNORE INTO internship (username, app_number, duration_months) VALUES (?, ?, ?)",
      [session.username, next_num, duration_months || null]
    );
  } else if (job_type === "Full-time") {
    await db.query(
      "INSERT IGNORE INTO full_time (username, app_number, equity_offered, sign_on_bonus) VALUES (?, ?, ?, ?)",
      [session.username, next_num, equity_offered || null, sign_on_bonus || null]
    );
  }

  return NextResponse.json(
    {
      id: String(next_num),
      company_name,
      job_title,
      status: status || "Saved",
      date_applied: date_applied || new Date().toISOString().split("T")[0],
      salary_expectation: salary_expectation || 0,
      job_url: "",
      notes: notes || "",
      tags: tags || [],
      job_type: job_type || null,
      duration_months: job_type === "Internship" ? (duration_months || null) : null,
      equity_offered: job_type === "Full-time" ? (equity_offered || null) : null,
      sign_on_bonus: job_type === "Full-time" ? (sign_on_bonus || null) : null,
      documents: [],
    },
    { status: 201 }
  );
}

export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.query("DELETE FROM application WHERE username = ?", [session.username]);
  return NextResponse.json({ ok: true });
}
