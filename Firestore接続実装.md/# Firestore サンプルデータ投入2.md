# Firestore サンプルデータ投入2

## 目的
Firestoreの `ads` コレクションにサンプルデータ10件を投入し、画面確認できる状態にする。

---

## 前提
- Firebase Web App 設定値は `.env.local` に設定する
- サービスアカウントJSONは使わない

---

## 作業内容

### 1. 環境設定
`.env.local` に以下を設定

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

---

### 2. Firestoreデータ投入

`ads` コレクションに10件投入

条件：
- 合計10件
- 画像あり7件
- 画像なし3件（imageUrl: null）
- externalUrl は全件必須
- createdAt は serverTimestamp()

---

### 3. 動作確認

http://localhost:3000 を開く

確認項目：
- 一覧表示できる
- モーダル表示できる
- 外部リンク遷移できる

---

## 完了条件
- 上記確認がすべてOK
- 「画面確認してよい状態」と報告