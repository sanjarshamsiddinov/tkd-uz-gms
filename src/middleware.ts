import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const publicPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/api/auth",
]

const publicPagePaths = [
  "/rankings",
  "/events",
  "/athletes",
]

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Allow public paths
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Allow public page paths at root level (public portal)
  if (pathname === "/" && !req.auth) {
    // Redirect unauthenticated users at root to login
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Allow public pages
  if (publicPagePaths.some((p) => pathname.startsWith(p)) && pathname.startsWith("/")) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|og-image.png|api/auth).*)",
  ],
}
