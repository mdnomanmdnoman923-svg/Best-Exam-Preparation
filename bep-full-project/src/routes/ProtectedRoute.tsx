// src/routes/ProtectedRoute.tsx

import React, { ReactNode, useMemo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import * as authStoreModule from '@/store/auth.store';

type AuthUser = {
  uid?: string;
  id?: string;
  role?: string;
  isAdmin?: boolean;
  premium?: boolean;
  premiumExpiresAt?: string | number | Date | null;
  [key: string]: unknown;
};

type AuthStoreShape = {
  user?: AuthUser | null;
  currentUser?: AuthUser | null;
  isAuthenticated?: boolean;
  loading?: boolean;
  isLoading?: boolean;
  initialized?: boolean;
  ready?: boolean;
};

type ProtectedRouteProps = {
  children?: ReactNode;
  redirectTo?: string;
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

export default function ProtectedRoute({
  children,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const location = useLocation();
  const auth = useAuthStoreSafe();

  const loading = Boolean(auth.loading || auth.isLoading);
  const allowed = useMemo(() => isLoggedIn(auth), [auth]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070B14] text-white">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
          <div className="text-sm font-medium tracking-wide text-white/80">
            লোড হচ্ছে...
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
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
