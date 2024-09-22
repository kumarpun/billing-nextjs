// export { default } from "next-auth/middleware";

// export const config = { matcher: [
//     "/dashboard",
//     "/listOrder/:path*",
//     "/addOrder/:path*",
//     "/addTable",
//     "/listReport",
//     "/listSales"
// ] };

import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const authToken = request.cookies.get("authToken");

  const publicPaths = ["/", "/auth/register"];

  // Get the URL pathname
  const pathname = request.nextUrl.pathname;
  console.log({ pathname, authToken });


  if (publicPaths.includes(pathname) && authToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (publicPaths.includes(pathname) && !authToken) {
    NextResponse.next(); // Allow public access
    return;
  }

  // Check if the user is trying to access a public path or if the authToken is present
  if (authToken) {
    NextResponse.next(); // Allow access
    return;
  }

  // Redirect to the login page if the authToken is not present
  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/listOrder/:path*",
    "/addOrder/:path*",
    "/addTable",
    "/listReport",
    "/listSales",
    "/auth/register"
  ],
};
