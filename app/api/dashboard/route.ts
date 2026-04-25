import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

function toDate(val: unknown): string {
  if (!val) return "";
  if (val instanceof Date) return val.toISOString().split("T")[0];
  return String(val).split("T")[0];
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { username } = session;

  const [sumRows] = await db.query(
    `SELECT
       COUNT(*) AS total,
       SUM(status NOT IN ('Saved')) AS applied,
       SUM(status IN ('Interviewing', 'Offer', 'Offered', 'Rejected')) AS responded,
       SUM(status = 'Interviewing') AS interviewing,
       SUM(status IN ('Offer', 'Offered')) AS offers
     FROM application WHERE username = ?`,
    [username]
  ) as any[];
  const s = (sumRows as any[])[0];

  const [pendRows] = await db.query(
    `SELECT COUNT(*) AS pending FROM interview
     WHERE username = ? AND interview_date >= CURDATE()`,
    [username]
  ) as any[];
  const pending = Number((pendRows as any[])[0].pending);

  const [weekRows] = await db.query(
    `SELECT
       DATE_FORMAT(DATE_SUB(app_date, INTERVAL WEEKDAY(app_date) DAY), '%Y-%m-%d') AS week_start,
       COUNT(*) AS count
     FROM application
     WHERE username = ? AND app_date IS NOT NULL AND app_date >= DATE_SUB(CURDATE(), INTERVAL 63 DAY)
     GROUP BY week_start ORDER BY week_start`,
    [username]
  ) as any[];

  const [pipeRows] = await db.query(
    `SELECT status, COUNT(*) AS count FROM application WHERE username = ? GROUP BY status`,
    [username]
  ) as any[];

  return NextResponse.json({
    total: Number(s.total),
    responseRate:
      Number(s.applied) > 0
        ? Math.round((Number(s.responded) / Number(s.applied)) * 100)
        : 0,
    pendingInterviews: pending,
    offers: Number(s.offers),
    weekly: (weekRows as any[]).map((r) => ({
      date: String(r.week_start),
      count: Number(r.count),
    })),
    pipeline: (pipeRows as any[]).map((r) => ({
      status: r.status === "Offered" ? "Offer" : r.status,
      count: Number(r.count),
    })),
  });
}
