import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [rows] = await db.query(
    `SELECT r.recruiter_id, r.first_name, r.last_name, r.email, r.company_name
     FROM recruiter r
     JOIN communicates_with cw ON r.recruiter_id = cw.recruiter_id
     WHERE cw.username = ?
     ORDER BY r.company_name, r.last_name`,
    [session.username]
  ) as any[];

  return NextResponse.json(rows as any[]);
}
