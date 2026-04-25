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
  const app_number = parseInt(id, 10);
  const { company_name, job_title, status, date_applied, salary_expectation, notes, tags,
          job_type, duration_months, equity_offered, sign_on_bonus } =
    await req.json();

  if (company_name) {
    await db.query("INSERT IGNORE INTO company (company_name) VALUES (?)", [company_name]);
  }

  await db.query(
    `UPDATE application
     SET company_name = ?, job_title = ?, status = ?, app_date = ?, salary = ?, notes = ?
     WHERE username = ? AND app_number = ?`,
    [
      company_name,
      job_title,
      status,
      (status === "Saved") ? null : (date_applied || new Date().toISOString().split("T")[0]),
      salary_expectation || null,
      notes || null,
      session.username,
      app_number,
    ]
  );

  await db.query(
    "DELETE FROM application_tags WHERE username = ? AND app_number = ?",
    [session.username, app_number]
  );

  if (tags && tags.length > 0) {
    for (const tag of tags as string[]) {
      await db.query(
        "INSERT IGNORE INTO application_tags (username, app_number, tags) VALUES (?, ?, ?)",
        [session.username, app_number, tag]
      );
    }
  }

  await db.query("DELETE FROM internship WHERE username = ? AND app_number = ?", [session.username, app_number]);
  await db.query("DELETE FROM full_time WHERE username = ? AND app_number = ?", [session.username, app_number]);

  if (job_type === "Internship") {
    await db.query(
      "INSERT INTO internship (username, app_number, duration_months) VALUES (?, ?, ?)",
      [session.username, app_number, duration_months || null]
    );
  } else if (job_type === "Full-time") {
    await db.query(
      "INSERT INTO full_time (username, app_number, equity_offered, sign_on_bonus) VALUES (?, ?, ?, ?)",
      [session.username, app_number, equity_offered || null, sign_on_bonus || null]
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const app_number = parseInt(id, 10);

  await db.query(
    "DELETE FROM application WHERE username = ? AND app_number = ?",
    [session.username, app_number]
  );

  return NextResponse.json({ ok: true });
}
