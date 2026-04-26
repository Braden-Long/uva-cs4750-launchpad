import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const recruiter_id = parseInt(id, 10);
  const { first_name, last_name, email, company_name } = await req.json();

  if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !company_name?.trim()) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // Verify this recruiter belongs to the current user
  const [check] = await db.query(
    "SELECT 1 FROM communicates_with WHERE username = ? AND recruiter_id = ?",
    [session.username, recruiter_id]
  ) as any[];
  if (!(check as any[]).length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.query("INSERT IGNORE INTO company (company_name) VALUES (?)", [company_name.trim()]);

  await db.query(
    "UPDATE recruiter SET first_name = ?, last_name = ?, email = ?, company_name = ? WHERE recruiter_id = ?",
    [first_name.trim(), last_name.trim(), email.trim(), company_name.trim(), recruiter_id]
  );

  return NextResponse.json({ recruiter_id, first_name: first_name.trim(), last_name: last_name.trim(), email: email.trim(), company_name: company_name.trim() });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const recruiter_id = parseInt(id, 10);

  await db.query(
    "DELETE FROM communicates_with WHERE username = ? AND recruiter_id = ?",
    [session.username, recruiter_id]
  );

  return NextResponse.json({ ok: true });
}
