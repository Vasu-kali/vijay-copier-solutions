import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = (req.auth?.user as any)?.role === "ADMIN";

  // Protect account routes
  if (pathname.startsWith("/account") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/auth/login", req.url));
    if (!isAdmin) return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect checkout
  if (pathname.startsWith("/checkout") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login?callbackUrl=/checkout", req.url));
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
    "/checkout/:path*",
    "/auth/:path*",
  ],
};
