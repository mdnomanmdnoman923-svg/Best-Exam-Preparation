// bep-full-project/src/routes/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';

import { useAuthState } from '@/hooks/useAuthState';

interface ProtectedRouteProps {
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
          Loading your study space
        </h1>

        <p className="mt-3 text-sm leading-7 text-white/60">
          We are checking your account and restoring your personalized BEP experience.
        </p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-cyan-400/70" />
        </div>
      </div>
    </div>
  );
}

function AccessPrompt() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <div className="w-full max-w-lg overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
        <div className="relative overflow-hidden p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_30%)]" />

          <div className="relative z-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
              <ShieldCheck className="h-9 w-9" />
            </div>

            <h1 className="mt-6 text-3xl font-black tracking-tight">
              Sign in required
            </h1>

            <p className="mt-4 text-sm leading-8 text-white/60">
              This area is available only after you log in.
              Your account keeps progress, bookmarks, and study history protected.
            </p>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-[#08111F]/75 p-4 text-left">
              <p className="text-sm leading-7 text-white/65">
                After signing in, you will be taken back to the page you were trying to open.
              </p>
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
                onClick={() => (window.location.href = '/auth')}
                className="rounded-2xl bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
              >
                Go to login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, loading } = useAuthState();

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

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
}
