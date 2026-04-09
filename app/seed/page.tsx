"use client";

import React from "react";
import { seedAds } from "@/lib/seedAds";

export default function SeedPage() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");

  const handleSeed = async () => {
    try {
      setStatus("loading");
      setMessage("データを投入中...");
      await seedAds();
      setStatus("success");
      setMessage("サンプルの10件を正常に投入しました！広告一覧ページを確認してください。");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(`投入に失敗しました: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-6">Firestore サンプルデータ投入</h1>
        
        <p className="text-neutral-600 mb-8">
          ボタンを押すと、`ads` コレクションに10件のサンプルデータを投入します。
          事前に `.env.local` の設定が完了していることを確認してください。
        </p>

        <button
          onClick={handleSeed}
          disabled={status === "loading"}
          className={`w-full py-4 rounded-xl font-bold text-white transition ${
            status === "loading" ? "bg-neutral-400 cursor-not-allowed" : "bg-neutral-950 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {status === "loading" ? "投入中..." : "データ投入を開始"}
        </button>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-sm font-medium ${
            status === "success" ? "bg-green-50 text-green-700" : 
            status === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
          }`}>
            {message}
          </div>
        )}

        {status === "success" && (
          <div className="mt-4">
            <a href="/" className="text-blue-600 font-semibold hover:underline">
              ← 広告一覧へ戻る
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
