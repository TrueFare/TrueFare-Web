import type { H3Event } from 'h3';

export interface SessionData {
  id: string;
  role: 'super_admin' | 'admin' | 'user';
}

export const AUTH_COOKIE_NAME = 'auth_session';
export const AUTH_HINT_COOKIE_NAME = 'auth_session_hint';
export const AUTH_ROLE_COOKIE_NAME = 'auth_role_hint';

export const getSession = (event: H3Event): SessionData | null => {
  const sessionCookie = getCookie(event, AUTH_COOKIE_NAME);
  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie) as SessionData;
  } catch (e) {
    return null;
  }
};

export const setSession = (event: H3Event, session: SessionData) => {
  const isProd = process.env.NODE_ENV === 'production';
  
  setCookie(event, AUTH_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: isProd,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax'
  });

  // Set the hint cookies (accessible by client-side JS/SSR logic)
  setCookie(event, AUTH_HINT_COOKIE_NAME, session.id, {
    secure: isProd,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  });

  setCookie(event, AUTH_ROLE_COOKIE_NAME, session.role, {
    secure: isProd,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  });
};

export const clearSession = (event: H3Event) => {
  deleteCookie(event, AUTH_COOKIE_NAME, { path: '/' });
  deleteCookie(event, AUTH_HINT_COOKIE_NAME, { path: '/' });
  deleteCookie(event, AUTH_ROLE_COOKIE_NAME, { path: '/' });
};

export const requireSession = (event: H3Event) => {
  const session = getSession(event);
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
  return session;
};

export const requireRole = (event: H3Event, roles: string[]) => {
  const session = requireSession(event);
  if (!roles.includes(session.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    });
  }
  return session;
};
