// src/routes/AdminRoute.tsx

import React, { ReactNode, useMemo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import * as authStoreModule from '@/store/auth.store';

type AuthUser = {
  uid?: string;
  id?: string;
  role?: string;
  isAdmin?: boolean;
  permissions?: string[];
  [key: string]: unknown;
};

type AuthStoreShape = {
  user?: AuthUser | null;
  currentUser?: AuthUser | null;
  isAuthenticated?: boolean;
  loading?: boolean;
  isLoading?: boolean;
};

type AdminRouteProps = {
  children?: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
};

function useAuthStoreSafe(): AuthStoreShape {
  const exported: unknown = (authStoreModule as Record<string, unknown>).default
    ?? (authStoreModule as Record<string, unknown>).useAuthStore
    ?? authStoreModule;

  if (typeof exported === 'function') {
    return (exported as () => AuthStoreShape)();
  }

  return exported as AuthStoreShape;
}

function isLoggedIn(store: AuthStoreShape): boolean {
  if (typeof store.isAuthenticated === 'boolean') return store.isAuthenticated;

  const user = store.user ?? store.currentUser ?? null;
  return Boolean(user && (user.uid || user.id));
}

function isAdminUser(store: AuthStoreShape): boolean {
  const user = store.user ?? store.currentUser ?? null;
  if (!user) return false;

  if (user.isAdmin === true) return true;

  const role = String(user.role ?? '').toLowerCase();
  if (role === 'admin' || role === 'superadmin' || role === 'super-admin') {
    return true;
  }

  return false;
}

export default function AdminRoute({
  children,
  redirectTo = '/login',
  fallback,
}: AdminRouteProps) {
  const location = useLocation();
  const auth = useAuthStoreSafe();

  const loading = Boolean(auth.loading || auth.isLoading);
  const allowed = useMemo(
    () => isLoggedIn(auth) && isAdminUser(auth),
    [auth],
  );

  if (loading) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex min-h-screen items-center justify-center bg-[#070B14] text-white">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
          <div className="text-sm font-medium tracking-wide text-white/80">
            অ্যাডমিন যাচাই করা হচ্ছে...
          </div>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          from: location.pathname + location.search,
          reason: 'admin-only',
        }}
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
