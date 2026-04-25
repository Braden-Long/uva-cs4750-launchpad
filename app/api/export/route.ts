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

  const [rows] = await db.query(
    `SELECT a.app_number, a.company_name, a.job_title, a.app_date, a.status, a.salary, a.notes,
       GROUP_CONCAT(at.tags ORDER BY at.tags SEPARATOR '|') AS tags
     FROM application a
     LEFT JOIN application_tags at ON a.username = at.username AND a.app_number = at.app_number
     WHERE a.username = ?
     GROUP BY a.app_number
     ORDER BY a.app_date DESC`,
    [session.username]
  ) as any[];

  const header = "Company,Title,Status,Date Applied,Salary,Notes,Tags";
  const csvRows = (rows as any[]).map((r) => {
    const notes = String(r.notes ?? "").replace(/"/g, '""');
    return [
      r.company_name ?? "",
      r.job_title ?? "",
      r.status === "Offered" ? "Offer" : (r.status ?? ""),
      toDate(r.app_date),
      r.salary ?? "",
      `"${notes}"`,
      r.tags ?? "",
    ].join(",");
  });

  const csv = [header, ...csvRows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="launchpad-export.csv"',
    },
  });
}
