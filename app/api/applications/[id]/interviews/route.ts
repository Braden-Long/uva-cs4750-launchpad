import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const app_number = parseInt(id, 10);

  const [rows] = await db.query(
    `SELECT interview_round, interview_date, interview_type
     FROM interview
     WHERE username = ? AND app_number = ?
     ORDER BY interview_round`,
    [session.username, app_number]
  ) as any[];

  return NextResponse.json((rows as any[]).map((r) => ({
    interview_round: r.interview_round,
    interview_date: r.interview_date ? String(r.interview_date).split("T")[0] : null,
    interview_type: r.interview_type,
  })));
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const app_number = parseInt(id, 10);
  const { interview_date, interview_type } = await req.json();

  if (!interview_type?.trim()) {
    return NextResponse.json({ error: "Interview type is required" }, { status: 400 });
  }

  const [numRows] = await db.query(
    "SELECT COALESCE(MAX(interview_round), 0) + 1 AS next_round FROM interview WHERE username = ? AND app_number = ?",
    [session.username, app_number]
  ) as any[];
  const next_round = (numRows as any[])[0].next_round;

  await db.query(
    "INSERT INTO interview (username, app_number, interview_round, interview_date, interview_type) VALUES (?, ?, ?, ?, ?)",
    [session.username, app_number, next_round, interview_date || null, interview_type.trim()]
  );

  return NextResponse.json({ interview_round: next_round, interview_date: interview_date || null, interview_type: interview_type.trim() }, { status: 201 });
}
