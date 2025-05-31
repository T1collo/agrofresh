import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/catalogue',
  '/images',
  '/favicon.ico',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const { data: { session }, error } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if it's an auth page
  const isAuthPage = pathname.startsWith('/auth');
  
  // Check if it's an API route
  const isApiRoute = pathname.startsWith('/api');
  
  // Check if it's a static file
  const isStaticFile = pathname.startsWith('/_next') || 
                      pathname.startsWith('/static') ||
                      pathname.includes('.');

  // Check if it's an admin route
  const isAdminRoute = pathname.startsWith('/admin');

  // Handle auth pages
  if (isAuthPage && session) {
    // Redirect to home if user is already logged in
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Handle protected routes (everything except public, auth, API, and static files)
  if (!isPublicRoute && !isAuthPage && !isApiRoute && !isStaticFile && !session) {
    // Redirect to login if accessing protected route without session
    const redirectUrl = new URL('/auth', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle admin routes
  if (isAdminRoute && session) {
    // Check if user is admin
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 