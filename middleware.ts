import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "launchpad-cs4750-uva-secret-key-2026"
);

const publicPaths = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));
  const token = request.cookies.get("session")?.value;

  if (!token) {
    if (!isPublic) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.next();
  }

  try {
    await jwtVerify(token, SECRET);
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
