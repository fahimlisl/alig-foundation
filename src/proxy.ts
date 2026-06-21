import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const adminAccessToken = request.cookies.get("adminAccessToken")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/auth") {
    if (adminAccessToken) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!adminAccessToken) {
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};