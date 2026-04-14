'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase'; // firebase初期化ファイルのパスを確認してください
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Ad } from '@/types/ad';

export default function PostPage() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        externalUrl: '',
        description: '',
        imageUrl: '',
        tags: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        if (!formData.title || !formData.externalUrl) {
            setErrorMessage('タイトルとリンクURLは必須です。');
            return;
        }

        setLoading(true);
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
            };

            await addDoc(adsCollection, newAd);
            setSuccessMessage('テスト投稿ありがとうございます。正常に送信されました。');
            setFormData({ title: '', externalUrl: '', description: '', imageUrl: '', tags: '' });
        } catch (error) {
            console.error('Firestore Error:', error);
            setErrorMessage('投稿に失敗しました。コンソールを確認してください。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-2xl mx-auto p-8">
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
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold transition-colors disabled:bg-gray-600"
                >
                    {loading ? '送信中...' : 'この内容で公開する'}
                </button>
            </form>
        </main>
    );
}