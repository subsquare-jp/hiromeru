"use client";

import React from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Ad } from "@/types/ad";

export default function AdMvpMockPage() {
  const [ads, setAds] = React.useState<Ad[]>([]);
  const [selectedAd, setSelectedAd] = React.useState<Ad | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchAds() {
      try {
        setLoading(true);
        setError(null);

        const q = query(
          collection(db, "ads"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const nextAds: Ad[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            title: data.title ?? "",
            description: data.description ?? "",
            imageUrl: data.imageUrl ?? "",
            externalUrl: data.externalUrl ?? "",
            tags: Array.isArray(data.tags) ? data.tags : [],
            adType: data.adType ?? "self",
            status: data.status ?? "published",
            createdAt: data.createdAt,
            updatedAt: data.updatedAt || data.createdAt,
          };
        });

        setAds(nextAds);
      } catch (err) {
        console.error(err);
        setError("広告データの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    }

    fetchAds();
  }, []);

  React.useEffect(() => {
    if (selectedAd) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedAd]);
  const rightColumnAds = ads.filter((_, index) => index % 2 === 0)
  const leftColumnAds = ads.filter((_, index) => index % 2 === 1)
  return (
    <div className="min-h-screen bg-neutral-100">
      <main className="mx-auto max-w-xl p-4">
        <h1 className="mb-4 text-xl font-bold">広告一覧</h1>
        <a
          href="/post"
          className="mb-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-bold text-white"
        >
          広告を投稿する
        </a>

        {loading && (
          <p className="text-sm text-neutral-500">読み込み中...</p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && ads.length === 0 && (
          <p className="text-sm text-neutral-500">広告はまだありません。</p>
        )}

        {!loading && !error && ads.length > 0 && (
          <section className="flex flex-row-reverse gap-3">
            <div className="flex w-1/2 flex-col gap-3">
              {rightColumnAds.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onClick={() => setSelectedAd(ad)}
                />
              ))}
            </div>

            <div className="flex w-1/2 flex-col gap-3">
              {leftColumnAds.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onClick={() => setSelectedAd(ad)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <AdDetailModal
        ad={selectedAd}
        onClose={() => setSelectedAd(null)}
      />
    </div>
  );
}

function AdCard({
  ad,
  onClick,
}: {
  ad: Ad;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-3 block w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm shadow-black/10 transition active:scale-[0.99]"
      aria-label={`${ad.title} の詳細を開く`}
    >
      {ad.imageUrl ? (
        <img
          src={ad.imageUrl}
          alt={ad.title}
          className="block w-full object-cover"
        />
      ) : (
        <div className="flex h-[150px] items-center justify-center bg-neutral-200 text-sm font-bold text-neutral-400">
          NO IMAGE
        </div>
      )}

      <div className="px-3 pb-3 pt-2.5">
        <p className="text-[14px] font-bold leading-[1.4]">{ad.title}</p>
        <p className="mt-1.5 text-[11px] text-neutral-500">広告</p>
      </div>
    </button>
  );
}

function AdDetailModal({
  ad,
  onClose,
}: {
  ad: Ad | null;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (ad) {
      document.addEventListener("keydown", onKeyDown);
    }

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [ad, onClose]);

  if (!ad) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <section
        className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-t-[24px] bg-white shadow-2xl sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ad-detail-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-3xl leading-none text-white"
          aria-label="閉じる"
        >
          ×
        </button>

        <div className="max-h-[90vh] overflow-y-auto overscroll-contain">
          {ad.imageUrl ? (
            <div className="bg-neutral-200">
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="block max-h-[52vh] w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300 text-sm font-bold tracking-[0.18em] text-neutral-500">
              NO IMAGE
            </div>
          )}

          <div className="px-4 pb-5 pt-4">
            <span className="mb-1 block text-xs text-neutral-500">広告</span>
            <h2
              id="ad-detail-title"
              className="text-[22px] font-extrabold leading-[1.35]"
            >
              {ad.title}
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-[14px] leading-[1.7] text-neutral-700">
              {ad.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {ad.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-5">
              <a
                href={ad.externalUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="block w-full rounded-xl bg-neutral-950 px-4 py-4 text-center text-sm font-bold text-white"
              >
                外部リンクを見る
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
