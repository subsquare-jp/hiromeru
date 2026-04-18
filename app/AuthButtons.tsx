'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from './AuthProvider';

const AuthButtons = () => {
  const { user, loading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const formatError = (error: unknown) => {
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = error as any;
      return `${e.code}: ${e.message}`;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return '不明なエラーが発生しました。';
  };

  const handleSignIn = async () => {
    console.log('[AuthButtons] handleSignIn called');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    setAuthError(null);

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const message = formatError(error);
      setAuthError(`Googleログインに失敗しました: ${message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) return null;

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">{user.displayName}</span>
          <button
            onClick={handleSignOut}
            className="rounded-lg bg-red-500 px-3 py-1 text-sm font-bold text-white hover:bg-red-600"
          >
            ログアウト
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={handleSignIn}
            className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm sm:px-5 sm:py-3 sm:text-base font-bold text-white shadow-md hover:bg-blue-600 transition-all active:scale-95 whitespace-nowrap"
          >
            Googleログイン
          </button>
          {authError && (
            <div className="rounded-2xl bg-red-50 px-4 py-2 text-xs text-red-700">
              {authError}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthButtons;