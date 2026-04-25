import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const text = await req.text();
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return NextResponse.json({ error: "No data rows found" }, { status: 400 });

  const [, ...dataLines] = lines; // skip header row

  const [numRows] = await db.query(
    "SELECT COALESCE(MAX(app_number), 0) AS max_num FROM application WHERE username = ?",
    [session.username]
  ) as any[];
  let nextNum = Number((numRows as any[])[0].max_num) + 1;

  let imported = 0;
  for (const line of dataLines) {
    const cols = parseCSVLine(line);
    const [company, title, status, date, salary, notes, tags] = cols;
    if (!company || !title) continue;

    await db.query("INSERT IGNORE INTO company (company_name) VALUES (?)", [company]);
    await db.query(
      `INSERT INTO application (username, app_number, company_name, job_title, app_date, status, salary, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.username,
        nextNum,
        company,
        title,
        date || null,
        status || "Saved",
        salary ? parseFloat(salary) : null,
        notes || null,
      ]
    );

    if (tags) {
      for (const tag of tags.split("|")) {
        const t = tag.trim();
        if (t) {
          await db.query(
            "INSERT IGNORE INTO application_tags (username, app_number, tags) VALUES (?, ?, ?)",
            [session.username, nextNum, t]
          );
        }
      }
    }

    nextNum++;
    imported++;
  }

  return NextResponse.json({ imported });
}
