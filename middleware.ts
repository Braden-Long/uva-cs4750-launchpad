import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecret } from "@/lib/jwt-secret";

const publicPaths = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));
  const token = request.cookies.get("session")?.value;

  if (!token) {
    if (!isPublic) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.next();
  }

  // Resolved outside the try so a misconfigured JWT_SECRET fails loudly instead
  // of silently downgrading every request to "logged out".
  const secret = getJwtSecret();

  try {
    await jwtVerify(token, secret);
    if (isPublic) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("session");
    return res;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
