import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for admin routes
  if (pathname.startsWith("/")) {
    // Allow access to login page
    if (pathname === "/login") {
      return NextResponse.next();
    }

    // For client-side routes, we'll let React handle auth checking
    // since localStorage is not available in middleware (server-side)
    // The auth check will be handled by the layout component
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
