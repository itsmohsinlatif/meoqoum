import createMiddleware from 'next-intl/middleware';
import { routing } from './config/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
