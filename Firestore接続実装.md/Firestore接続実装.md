# Firestore接続実装.md

## 目的

既存の一覧UI・モーダルUIは完成しているため、ダミーデータをやめて Firestore の `ads` コレクションから一覧取得する実装に切り替える。

今回は **読み取りのみ** 実装する。

---

## PM判断の反映

以下を前提として実装する。

* `imageUrl` は `string | null`
* 画像は任意
* `imageUrl` が未設定のときは、UI側でデフォルト画像またはプレースホルダー表示を行う
* `createdAt` は **server timestamp 前提**
* 新着順表示は `createdAt desc`

---

## 実装範囲

今回やることは以下だけ。

* Firestoreに接続する
* `ads` コレクションを新着順で取得する
* 取得したデータを一覧UIに表示する
* 既存のモーダル表示をそのまま使う

今回まだやらないこと。

* 投稿
* Storageアップロード
* タグ検索
* 無限スクロール
* 計測
* 認証

---

## 1. パッケージ追加

```bash id="pk001"
npm install firebase
```

---

## 2. 型定義を追加

### `types/ad.ts`

```ts id="code001"
import { Timestamp } from "firebase/firestore";

export type Ad = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  externalUrl: string;
  tags: string[];
  createdAt: Timestamp;
};
```

---

## 3. Firebase初期化ファイルを追加

### `lib/firebase.ts`

```ts id="code002"
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
```

---

## 4. 環境変数を追加

### `.env.local`

```env id="code003"
NEXT_PUBLIC_FIREBASE_API_KEY=xxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxx
```

※ 値は Firebase コンソールの設定値を入れる。

---

## 5. `app/page.tsx` を Firestore取得に置き換える

### `app/page.tsx`

```tsx id="code004"
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
            imageUrl: data.imageUrl ?? null,
            externalUrl: data.externalUrl ?? "",
            tags: Array.isArray(data.tags) ? data.tags : [],
            createdAt: data.createdAt,
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

  return (
    <div className="min-h-screen bg-neutral-100">
      <main className="mx-auto max-w-xl p-4">
        <h1 className="mb-4 text-xl font-bold">広告一覧</h1>

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
          <section className="columns-2 gap-3">
            {ads.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                onClick={() => setSelectedAd(ad)}
              />
            ))}
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
      className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-white text-left shadow-sm shadow-black/10 transition active:scale-[0.99]"
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
```

---

## 6. Firestoreに入れるサンプルデータ例

```ts id="code005"
import { serverTimestamp } from "firebase/firestore";

{
  title: "春の新作イラスト集",
  description: "やわらかい春色をテーマにした新作イラスト集です。",
  imageUrl: "https://example.com/sample.jpg",
  externalUrl: "https://example.com/ad/1",
  tags: ["イラスト", "新作"],
  createdAt: serverTimestamp()
}
```

画像なし例:

```ts id="code006"
import { serverTimestamp } from "firebase/firestore";

{
  title: "依頼受付スケジュール更新",
  description: "今月の依頼受付スケジュールを更新しました。",
  imageUrl: null,
  externalUrl: "https://example.com/ad/9",
  tags: ["スケジュール", "依頼受付"],
  createdAt: serverTimestamp()
}
```

---

## 実装上の注意

* `imageUrl` は `string | null`
* 画像未設定時はプレースホルダー表示で対応
* `createdAt` は必ず `serverTimestamp()` を使う
* `externalUrl` は必須
* 今回は読み取りのみ先に通す

---

## 誰が何をするか

* **Antigravity**

  * この.mdどおりに実装する
* **秘書**

  * 仕様書を「画像は任意」「未設定時はデフォルト画像を表示」に修正する
* **PM**

  * 実装方針確認済みとして進行する
* **CTO**

  * 実装結果がこの設計から逸れていないか最終確認する

---

## CTO判断

今回の段階では、**読む処理を先に完成させる**のが正しい。

* Firestoreは `ads` のみ
* UIは既存のまま
* ダミーデータをFirestore取得に置き換える
* `imageUrl` は null 許容
* `createdAt` は server timestamp

この順番がMVP公開まで最短。
