'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { Ad } from '@/types/ad';
import { useAuth } from '../AuthProvider';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Link from 'next/link';

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
        tags: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [isApproved, setIsApproved] = useState<boolean | null>(null);
    const [keyPassInput, setKeyPassInput] = useState('');
    const [keyPassError, setKeyPassError] = useState<string | null>(null);
    const [submittingKeyPass, setSubmittingKeyPass] = useState(false);

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
            console.log('[PostPage] Calling signInWithPopup...');
            await signInWithPopup(auth, provider);
            console.log('[PostPage] signInWithPopup completed');
        } catch (error) {
            const message = formatError(error);
            console.error('[PostPage] Sign in error:', message, error);
            setSignInError(`Googleログインに失敗しました: ${message}`);
        }
    };

    useEffect(() => {
        // Cleanup function for object URL to avoid memory leaks
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    useEffect(() => {
        const checkApproval = async () => {
            if (!user) {
                setIsApproved(null);
                return;
            }
            try {
                const docRef = doc(db, 'creatorAccess', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().approved === true) {
                    setIsApproved(true);
                } else {
                    setIsApproved(false);
                }
            } catch (err) {
                console.error('Error checking approval:', err);
                setIsApproved(false);
            }
        };
        checkApproval();
    }, [user]);

    const handleKeyPassSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setKeyPassError(null);
        const correctKey = process.env.NEXT_PUBLIC_CREATOR_KEYPASS;
        
        if (!correctKey) {
            setKeyPassError('システムエラー: キーパスが環境変数に設定されていません。');
            return;
        }

        if (keyPassInput === correctKey) {
            if (!user) return;
            setSubmittingKeyPass(true);
            try {
                const docRef = doc(db, 'creatorAccess', user.uid);
                await setDoc(docRef, {
                    uid: user.uid,
                    email: user.email || '',
                    displayName: user.displayName || '',
                    approved: true,
                    approvedAt: serverTimestamp(),
                    approvedBy: "common_key"
                });
                setIsApproved(true);
            } catch (err) {
                setKeyPassError(`承認情報の保存に失敗しました: ${formatError(err)}`);
            } finally {
                setSubmittingKeyPass(false);
            }
        } else {
            setKeyPassError('キーパスが正しくありません。');
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
            let uploadedImageUrl = '';
            
            // 1. 画像があれば Storage にアップロード
            if (imageFile) {
                // ファイルサイズチェック (3MB)
                if (imageFile.size > 3 * 1024 * 1024) {
                    throw new Error('画像は3MB以下にしてください。');
                }
                // 形式チェック
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (!allowedTypes.includes(imageFile.type)) {
                    throw new Error('対応していない画像形式です。jpg, jpeg, png, webp が利用可能です。');
                }

                const timestamp = Date.now();
                const safeFileName = imageFile.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
                const storagePath = `images/${user.uid}/${timestamp}-${safeFileName}`;
                const storageRef = ref(storage, storagePath);
                
                const uploadResult = await uploadBytes(storageRef, imageFile);
                uploadedImageUrl = await getDownloadURL(uploadResult.ref);
            }

            // 2. Firestore `ads` に保存
            const adsCollection = collection(db, 'ads');
            const newAd: Ad = {
                title: formData.title,
                externalUrl: formData.externalUrl,
                description: formData.description || '',
                imageUrl: uploadedImageUrl,
                hasImage: !!imageFile,
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
            setFormData({ title: '', externalUrl: '', description: '', tags: '' });
            setImageFile(null);
            setImagePreview(null);
            // file input をリセットするために key を管理する方法もあるが、今回は簡易的にそのまま
        } catch (error) {
            const message = formatError(error);
            console.error('Submit Error:', message, error);
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
                <div className="mb-6 text-xs text-neutral-500">
                    投稿前に以下をご確認ください：
                    <Link href="/kiyaku" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mx-1">利用規約</Link> / 
                    <Link href="/image_rule" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mx-1">画像投稿ルール</Link> / 
                    <Link href="/18over" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mx-1">18禁注意</Link>
                </div>
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

    if (isApproved === false) {
        return (
            <main className="max-w-2xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-4">キーパスの入力</h1>
                <div className="mb-8 rounded-3xl border border-neutral-300 bg-white p-5 text-sm text-neutral-700">
                    <p className="mb-2 font-bold">投稿権限の確認</p>
                    <p>投稿するには運営から共有されたキーパスが必要です。</p>
                </div>
                {keyPassError && (
                  <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {keyPassError}
                  </div>
                )}
                <form onSubmit={handleKeyPassSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">キーパス (必須)</label>
                        <input
                            type="password"
                            placeholder="共有されたキーパスを入力"
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                            value={keyPassInput}
                            onChange={(e) => setKeyPassInput(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submittingKeyPass}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors disabled:bg-gray-600"
                    >
                        {submittingKeyPass ? '確認中...' : 'キーパスを確認する'}
                    </button>
                </form>
            </main>
        );
    }

    if (isApproved === null) {
        return <div className="max-w-2xl mx-auto p-8">権限を確認中...</div>;
    }

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">広告を投稿する</h1>
            <div className="mb-8 rounded-3xl border border-neutral-300 bg-white p-5 text-sm text-neutral-700">
              <p className="mb-2 font-bold">画像なしのテスト投稿も歓迎しています</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>画像なしでも送信できます。</li>
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

            <div className="mb-6 text-xs text-neutral-500">
                投稿前に以下をご確認ください：
                <Link href="/kiyaku" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mx-1">利用規約</Link> / 
                <Link href="/image_rule" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mx-1">画像投稿ルール</Link> / 
                <Link href="/18over" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mx-1">18禁注意</Link>
            </div>

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
                    <label className="block text-sm font-semibold mb-2">画像（任意・3MBまで）</label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setImageFile(file);
                            if (file) {
                                const url = URL.createObjectURL(file);
                                setImagePreview(url);
                            } else {
                                setImagePreview(null);
                            }
                        }}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                    />
                    {imagePreview && (
                        <div className="mt-3 relative w-full max-w-xs aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-neutral-700">
                            <img
                                src={imagePreview}
                                alt="プレビュー"
                                className="w-full h-full object-contain"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImageFile(null);
                                    setImagePreview(null);
                                }}
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                                ×
                            </button>
                        </div>
                    )}
                    <p className="mt-1 text-xs text-gray-400">JPEG / PNG / WebP</p>
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