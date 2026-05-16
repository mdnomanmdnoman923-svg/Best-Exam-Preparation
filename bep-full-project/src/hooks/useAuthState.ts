// bep-full-project/src/hooks/useAuthState.ts

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { AuthUserProfile } from '@/firebase/auth';
import { getCurrentUser, onUserChanged } from '@/firebase/auth';

export interface UseAuthStateOptions {
  initialUser?: AuthUserProfile | null;
  listen?: boolean;
}

export interface UseAuthStateReturn {
  user: AuthUserProfile | null;
  loading: boolean;
  initialized: boolean;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  emailVerified: boolean;
  providerId: string | null;
  refresh: () => void;
  setUser: (user: AuthUserProfile | null) => void;
}

export default function useAuthState(
  options: UseAuthStateOptions = {},
): UseAuthStateReturn {
  const {
    initialUser = getCurrentUser(),
    listen = true,
  } = options;

  const [user, setUser] = useState<AuthUserProfile | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(!initialUser);
  const [initialized, setInitialized] = useState<boolean>(Boolean(initialUser));

  const applyCurrentUser = useCallback(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!listen) {
      applyCurrentUser();
      return;
    }

    setLoading(true);

    const subscription = onUserChanged((nextUser) => {
      setUser(nextUser);
      setLoading(false);
      setInitialized(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [applyCurrentUser, listen]);

  const refresh = useCallback(() => {
    applyCurrentUser();
  }, [applyCurrentUser]);

  const value = useMemo<UseAuthStateReturn>(() => {
    return {
      user,
      loading,
      initialized,
      isAuthenticated: Boolean(user),
      isAnonymous: Boolean(user?.isAnonymous),
      emailVerified: Boolean(user?.emailVerified),
      providerId: user?.providerId ?? null,
      refresh,
      setUser,
    };
  }, [initialized, loading, refresh, user]);

  return value;
}
