'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase'; // firebase初期化ファイルのパスを確認してください
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Ad } from '@/types/ad';
import { useAuth } from '../AuthProvider';
import { signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function PostPage() {
    const { user, loading } = useAuth();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [signInError, setSignInError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        externalUrl: '',
        description: '',
        imageUrl: '',
        tags: '',
    });

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
        console.log('[PostPage] handleSignIn called');
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        setSignInError(null);
        setErrorMessage(null);

        try {
            console.log('[PostPage] Calling signInWithRedirect...');
            await signInWithRedirect(auth, provider);
            console.log('[PostPage] signInWithRedirect completed (should redirect now)');
        } catch (error) {
            const message = formatError(error);
            console.error('[PostPage] Sign in error:', message, error);
            setSignInError(`Googleログインに失敗しました: ${message}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        if (!formData.title || !formData.externalUrl) {
            setErrorMessage('タイトルとリンクURLは必須です。');
            return;
        }
        if (!user) {
            setErrorMessage('ログインが必要です。');
            return;
        }

        setLoadingSubmit(true);
        try {
            const adsCollection = collection(db, 'ads');
            const newAd: Ad = {
                title: formData.title,
                externalUrl: formData.externalUrl,
                description: formData.description || '',
                imageUrl: formData.imageUrl.trim() || '',
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
                adType: 'self',
                status: 'published',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                testMode: true,
                source: 'open_test',
                ownerUid: user.uid,
                ownerEmail: user.email || '',
                ownerDisplayName: user.displayName || '',
            };

            await addDoc(adsCollection, newAd);
            setSuccessMessage('テスト投稿ありがとうございます。正常に送信されました。');
            setFormData({ title: '', externalUrl: '', description: '', imageUrl: '', tags: '' });
        } catch (error) {
            const message = formatError(error);
            console.error('Firestore Error:', message, error);
            setErrorMessage(`投稿に失敗しました: ${message}`);
        } finally {
            setLoadingSubmit(false);
        }
    };



    if (loading) {
        return <div className="max-w-2xl mx-auto p-8">読み込み中...</div>;
    }

    if (!user) {
        return (
            <main className="max-w-2xl mx-auto p-8">
                <section className="mb-6 rounded-3xl border border-neutral-300 bg-white p-5 text-sm text-neutral-700">
                    <p className="font-bold">【注意】</p>
                    <p>このサービスには、成人向け要素を含む投稿や外部リンクが含まれる場合があります。</p>
                    <p>これは注意表示であり、年齢認証ではありません。</p>
                    <p>18歳未満の方は、閲覧・投稿をしないでください。</p>
                    <p>運営は、問題があると判断した投稿を非表示・停止・削除する場合があります。</p>
                </section>
                <h1 className="text-3xl font-bold mb-4">広告を投稿する</h1>
                <div className="mb-8 rounded-3xl border border-neutral-300 bg-white p-5 text-sm text-neutral-700">
                    <p className="mb-2 font-bold">ログインが必要です</p>
                    <p>広告を投稿するにはGoogleログインが必要です。</p>
                </div>
                {signInError && (
                  <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {signInError}
                  </div>
                )}
                <button
                    onClick={handleSignIn}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600"
                >
                    Googleログイン
                </button>
            </main>
        );
    }

    return (
        <main className="max-w-2xl mx-auto p-8">
            <section className="mb-6 rounded-3xl border border-neutral-300 bg-white p-5 text-sm text-neutral-700">
                <p className="font-bold">【注意】</p>
                <p>このサービスには、成人向け要素を含む投稿や外部リンクが含まれる場合があります。</p>
                <p>これは注意表示であり、年齢認証ではありません。</p>
                <p>18歳未満の方は、閲覧・投稿をしないでください。</p>
                <p>運営は、問題があると判断した投稿を非表示・停止・削除する場合があります。</p>
            </section>
            <h1 className="text-3xl font-bold mb-4">広告を投稿する</h1>
            <div className="mb-8 rounded-3xl border border-neutral-300 bg-white p-5 text-sm text-neutral-700">
              <p className="mb-2 font-bold">画像なしのテスト投稿も歓迎しています</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>imageUrl は空欄でも送信できます。</li>
                <li>今はテスト投稿を歓迎しています。</li>
                <li>数十秒〜1分で投稿できます。</li>
              </ul>
            </div>
            {successMessage && (
              <div className="mb-6 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold mb-2">タイトル (必須)</label>
                    <input
                        required
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">リンクURL (必須)</label>
                    <input
                        required
                        type="url"
                        placeholder="https://..."
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                        value={formData.externalUrl}
                        onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">画像 URL (任意)</label>
                    <input
                        type="url"
                        placeholder="例: https://... （空欄でOK）"
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">説明文 (任意)</label>
                    <textarea
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white h-32"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loadingSubmit}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold transition-colors disabled:bg-gray-600"
                >
                    {loadingSubmit ? '送信中...' : 'この内容で公開する'}
                </button>
            </form>
        </main>
    );
}