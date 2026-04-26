import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { first_name, last_name, email, company_name } = await req.json();

  if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !company_name?.trim()) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // recruiter_id has no AUTO_INCREMENT — derive next value
  const [numRows] = await db.query(
    "SELECT COALESCE(MAX(recruiter_id), 0) + 1 AS next_id FROM recruiter"
  ) as any[];
  const next_id = (numRows as any[])[0].next_id;

  await db.query("INSERT IGNORE INTO company (company_name) VALUES (?)", [company_name.trim()]);

  await db.query(
    "INSERT INTO recruiter (recruiter_id, first_name, last_name, email, company_name) VALUES (?, ?, ?, ?, ?)",
    [next_id, first_name.trim(), last_name.trim(), email.trim(), company_name.trim()]
  );

  await db.query(
    "INSERT IGNORE INTO communicates_with (username, recruiter_id) VALUES (?, ?)",
    [session.username, next_id]
  );

  return NextResponse.json(
    { recruiter_id: next_id, first_name: first_name.trim(), last_name: last_name.trim(), email: email.trim(), company_name: company_name.trim() },
    { status: 201 }
  );
}
