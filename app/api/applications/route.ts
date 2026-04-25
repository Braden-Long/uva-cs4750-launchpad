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
       GROUP_CONCAT(at.tags ORDER BY at.tags SEPARATOR ',') AS tags
     FROM application a
     LEFT JOIN application_tags at ON a.username = at.username AND a.app_number = at.app_number
     WHERE a.username = ?
     GROUP BY a.app_number, a.company_name, a.job_title, a.app_date, a.status, a.salary, a.notes
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
  }));

  return NextResponse.json(applications);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { company_name, job_title, status, date_applied, salary_expectation, notes, tags } =
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
