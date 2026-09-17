import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public paths that don't require authentication
    const publicPaths = [
      "/",
      "/auth/login",
      "/auth/signup",
      "/auth/error",
      "/pricing",
      "/features",
      "/about",
      "/blog",
      "/terms",
      "/privacy",
      "/api/auth",
    ]

    const isPublicPath = publicPaths.some(
      (publicPath) => path === publicPath || path.startsWith(publicPath + "/")
    )

    if (isPublicPath) {
      return NextResponse.next()
    }

    // If no token and trying to access protected route, redirect to login
    if (!token) {
      const loginUrl = new URL("/auth/login", req.url)
      loginUrl.searchParams.set("callbackUrl", path)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        const publicPaths = [
          "/",
          "/auth/login",
          "/auth/signup",
          "/auth/error",
          "/pricing",
          "/features",
          "/about",
          "/blog",
          "/terms",
          "/privacy",
          "/api/auth",
        ]

        const isPublicPath = publicPaths.some(
          (publicPath) => path === publicPath || path.startsWith(publicPath + "/")
        )

        if (isPublicPath) return true
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}