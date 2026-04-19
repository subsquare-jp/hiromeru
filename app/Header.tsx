'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomeButton from './HomeButton';
import AuthButtons from './AuthButtons';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <div className="mx-auto max-w-xl px-2 sm:px-4 py-2">
        {/* Top Row: Home and Auth */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <HomeButton />
          <AuthButtons />
        </div>
        
        {/* Bottom Row: Post Ad (Only on Home Page) */}
        {isHomePage && (
          <div className="mt-2 sm:mt-3 flex justify-center">
            <Link
              href="/post"
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-orange-500 via-rose-500 to-purple-600 px-4 py-2.5 sm:px-6 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] leading-tight text-center"
            >
              <span>✨</span>
              <span className="whitespace-nowrap">先行テスト掲載に参加する</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
