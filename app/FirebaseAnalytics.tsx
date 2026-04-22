'use client';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function FirebaseAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
  
  if (!gaId) {
    console.warn('[FirebaseAnalytics] Measurement ID is missing.');
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
