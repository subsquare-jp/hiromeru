'use client';
import { useEffect } from 'react';
import { initAnalytics } from '@/lib/firebase';

export default function FirebaseAnalytics() {
  useEffect(() => {
    // クライアントサイドでのみ実行される
    if (process.env.NODE_ENV === 'production' || true) { // テスト用に常に有効化（必要に応じて本番のみに変更可能）
      initAnalytics().catch((err) => {
        console.error('[FirebaseAnalytics] Initialization failed:', err);
      });
    }
  }, []);

  return null;
}
