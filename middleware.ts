import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  // Check if the user is SYS_ADMIN (you might need to implement this check)
  const isSysAdmin = checkIfUserIsSysAdmin(request);

  if (isSysAdmin) {
    const url = new URL(request.url);
    const organizationId = url.searchParams.get("organizationId");

    if (organizationId) {
      // If organizationId is present, ensure it's preserved in the URL
      url.searchParams.set("organizationId", organizationId);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Implement this function to check if the user is SYS_ADMIN
function checkIfUserIsSysAdmin(request: NextRequest): boolean {
  // You might need to check the session or a token here
  // For now, let's assume we have a way to determine this
  return true; // Replace with actual logic
}

export const config = {
  matcher: "/:path*",
};
