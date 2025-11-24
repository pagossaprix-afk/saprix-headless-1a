import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getProductRedirectPath } from '@/lib/redirect-utils';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const match = pathname.match(/^\/producto\/(.+)$/);
    if (match) {
        const slug = match[1];
        const path = await getProductRedirectPath(slug);
        const url = request.nextUrl.clone();
        url.pathname = path;
        return NextResponse.redirect(url, 301);
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/producto/:slug*',
};
