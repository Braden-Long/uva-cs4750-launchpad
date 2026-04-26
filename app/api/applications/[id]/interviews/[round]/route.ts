import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; round: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, round } = await params;
  const app_number = parseInt(id, 10);
  const interview_round = parseInt(round, 10);

  await db.query(
    "DELETE FROM interview WHERE username = ? AND app_number = ? AND interview_round = ?",
    [session.username, app_number, interview_round]
  );

  return NextResponse.json({ ok: true });
}
