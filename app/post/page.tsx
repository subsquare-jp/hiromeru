'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase'; // firebase初期化ファイルのパスを確認してください
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Ad } from '@/types/ad';

export default function PostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        externalUrl: '',
        description: '',
        imageUrl: '',
        tags: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.externalUrl) return;

        setLoading(true);
        try {
            const adsCollection = collection(db, 'ads');
            const newAd: Ad = {
                title: formData.title,
                externalUrl: formData.externalUrl,
                description: formData.description || '',
                imageUrl: formData.imageUrl || '',
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
                adType: 'self',
                status: 'published',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await addDoc(adsCollection, newAd);
            alert('本人広告の投稿に成功しました！');
            router.push('/'); // 完了後トップへ
        } catch (error) {
            console.error('Firestore Error:', error);
            alert('投稿に失敗しました。コンソールを確認してください。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">広告を投稿する</h1>
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