import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken, SessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  const [rows] = await db.query(
    "SELECT username, first_name, last_name, password FROM app_user WHERE username = ?",
    [username]
  ) as any[];

  if (!(rows as any[]).length) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const user = (rows as any[])[0];

  // Support bcrypt hashes and plain-text (existing demo data)
  let valid = false;
  if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
    valid = await bcrypt.compare(password, user.password);
  } else {
    valid = password === user.password;
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const sessionUser: SessionUser = {
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
  };

  const token = await signToken(sessionUser);
  const response = NextResponse.json({ user: sessionUser });
  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
