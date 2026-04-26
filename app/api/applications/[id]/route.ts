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
  const { company_name, job_title, status, date_applied, salary_expectation, job_url, notes, tags,
          job_type, duration_months, equity_offered, sign_on_bonus, newDocuments, deletedDocIds } =
    await req.json();

  if (company_name) {
    await db.query("INSERT IGNORE INTO company (company_name) VALUES (?)", [company_name]);
  }

  await db.query(
    `UPDATE application
     SET company_name = ?, job_title = ?, status = ?, app_date = ?, salary = ?, notes = ?, job_url = ?
     WHERE username = ? AND app_number = ?`,
    [
      company_name,
      job_title,
      status,
      (status === "Saved") ? null : (date_applied || new Date().toISOString().split("T")[0]),
      salary_expectation || null,
      notes || null,
      job_url || null,
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

  if (deletedDocIds && deletedDocIds.length > 0) {
    for (const docId of deletedDocIds as number[]) {
      await db.query(
        "DELETE FROM submitted_with WHERE document_id = ? AND username = ? AND app_number = ?",
        [docId, session.username, app_number]
      );
      const [refs] = await db.query(
        "SELECT COUNT(*) AS cnt FROM submitted_with WHERE document_id = ?",
        [docId]
      ) as any[];
      if (Number((refs as any[])[0].cnt) === 0) {
        await db.query("DELETE FROM document WHERE document_id = ?", [docId]);
      }
    }
  }

  if (newDocuments && newDocuments.length > 0) {
    const [docNumRows] = await db.query(
      "SELECT COALESCE(MAX(document_id), 0) AS max_id FROM document"
    ) as any[];
    let nextDocId = Number((docNumRows as any[])[0].max_id) + 1;
    for (const doc of newDocuments as { title: string; doc_type: string }[]) {
      await db.query(
        "INSERT INTO document (document_id, title, doc_type, username) VALUES (?, ?, ?, ?)",
        [nextDocId, doc.title, doc.doc_type, session.username]
      );
      await db.query(
        "INSERT INTO submitted_with (document_id, username, app_number) VALUES (?, ?, ?)",
        [nextDocId, session.username, app_number]
      );
      nextDocId++;
    }
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
