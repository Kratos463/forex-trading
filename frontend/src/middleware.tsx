// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  const protectedRoutes = ['/user/dashboard', '/user/earning-payouts', '/user/referral-code',
    'user/settings', 'user/support', 'user/withdrawal', 'user/investment', 'user/referrals',
    'user/wallet'
  ];

  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*'],
};
