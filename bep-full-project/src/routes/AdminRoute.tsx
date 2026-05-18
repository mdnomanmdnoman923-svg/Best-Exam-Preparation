// bep-full-project/src/routes/AdminRoute.tsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';

import { useAuthState } from '@/hooks/useAuthState';

interface AdminRouteProps {
  children?: React.ReactNode;
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-100">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>

        <h1 className="mt-5 text-2xl font-black tracking-tight">
          Verifying admin access
        </h1>

        <p className="mt-3 text-sm leading-7 text-white/60">
          Please wait while we securely check your account permissions and role access.
        </p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-400/70" />
        </div>
      </div>
    </div>
  );
}

function UnauthorizedScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <div className="w-full max-w-lg overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
        <div className="relative overflow-hidden p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_30%)]" />

          <div className="relative z-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-red-400/20 bg-red-400/10 text-red-100">
              <ShieldAlert className="h-9 w-9" />
            </div>

            <h1 className="mt-6 text-3xl font-black tracking-tight">
              Access denied
            </h1>

            <p className="mt-4 text-sm leading-8 text-white/60">
              You do not have permission to access this admin route.
              Please contact an administrator if you believe this is a mistake.
            </p>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-[#08111F]/75 p-4 text-left">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-100">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Admin routes are protected
                  </h3>

                  <p className="mt-1 text-sm leading-7 text-white/55">
                    BEP uses role-based route protection to keep administrative tools,
                    analytics, and management panels secure.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                Go back
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = '/')}
                className="rounded-2xl bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
              >
                Return home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const location = useLocation();

  /**
   * Expected shape from useAuthState hook:
   *
   * {
   *   user: FirebaseUser | null
   *   profile?: {
   *     role?: string
   *   }
   *   loading: boolean
   * }
   */
  const { user, profile, loading } = useAuthState();

  const isAdmin =
    profile?.role === 'admin' ||
    profile?.role === 'super_admin';

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!isAdmin) {
    return <UnauthorizedScreen />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
}
