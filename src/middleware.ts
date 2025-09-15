import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("refresh_token")?.value;
  
  // Nếu đang ở trang login và đã có token -> redirect to homepage
  if (request.nextUrl.pathname === "/login") {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
  
  // Nếu chưa đăng nhập và truy cập vào các route protected -> redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các routes này
export const config = {
  matcher: ["/", "/blogs/:path*", "/profile/:path*"],
};