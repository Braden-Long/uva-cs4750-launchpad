import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken, SessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password, first_name, last_name } = await req.json();
  if (!username || !password || !first_name || !last_name) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const [existing] = await db.query(
    "SELECT username FROM app_user WHERE username = ?",
    [username]
  ) as any[];

  if ((existing as any[]).length) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  await db.query(
    "INSERT INTO app_user (username, first_name, last_name, password) VALUES (?, ?, ?, ?)",
    [username, first_name, last_name, hashed]
  );

  const sessionUser: SessionUser = { username, first_name, last_name };
  const token = await signToken(sessionUser);
  const response = NextResponse.json({ user: sessionUser }, { status: 201 });
  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
