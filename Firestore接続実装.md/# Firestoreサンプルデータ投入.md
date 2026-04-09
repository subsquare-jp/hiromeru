# Firestoreサンプルデータ投入.md

## 目的

Firestoreの実データで以下が成立するか確認する。

* 一覧表示
* モーダル表示
* 外部リンク遷移

今回は `ads` コレクションにサンプルデータを投入し、Akiが画面確認できる状態まで進める。

---

## 完了条件

以下が確認できたら完了。

1. `ads` コレクションに10件前後のデータが入っている
2. 画像あり7件・画像なし3件になっている
3. `localhost:3000` で一覧表示できる
4. カードクリックでモーダル表示できる
5. 外部リンク遷移できる
6. Akiが画面確認できる状態になっている

---

## 前提

* `imageUrl` は `string | null`
* `createdAt` は **`serverTimestamp()`**
* 画像なしデータは `imageUrl: null`
* `externalUrl` は全件必須

---

## 投入件数

* 合計: 10件
* 画像あり: 7件
* 画像なし: 3件

---

## フィールド構成

各ドキュメントは以下で統一する。

```ts id="adshape01"
{
  title: string,
  description: string,
  imageUrl: string | null,
  externalUrl: string,
  tags: string[],
  createdAt: serverTimestamp()
}
```

---

## 投入方法

Firebase Console の Firestore から手動投入でもよいが、件数が10件あるので、可能ならスクリプトまたはまとめ投入で進める。

ただしMVP段階なので、最短なら手動投入でも可。

---

## サンプルデータ案

```ts id="sampleads01"
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const sampleAds = [
  {
    title: "春の新作イラスト集",
    description: "やわらかい春色をテーマにした新作イラスト集です。サンプル画像とあわせて、作品ページへ遷移できます。",
    imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80",
    externalUrl: "https://example.com/ad/1",
    tags: ["イラスト", "新作"]
  },
  {
    title: "配信用オーバーレイ素材まとめ",
    description: "配信画面ですぐ使えるオーバーレイ素材のまとめページです。シンプル系・かわいい系を中心に掲載しています。",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    externalUrl: "https://example.com/ad/2",
    tags: ["配信", "素材"]
  },
  {
    title: "歌ってみた最新MV公開",
    description: "最新の歌ってみたMVを公開しました。視聴ページへの導線だけ成立すればよい想定で、画像なしパターンを確認する広告です。",
    imageUrl: null,
    externalUrl: "https://example.com/ad/3",
    tags: ["音楽", "MV"]
  },
  {
    title: "Live2Dモデル販売中",
    description: "配信者・動画投稿向けのLive2Dモデル販売ページです。サンプルや料金の詳細は外部リンク先で確認できます。",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
    externalUrl: "https://example.com/ad/4",
    tags: ["Live2D", "販売"]
  },
  {
    title: "限定ボイス作品リリース",
    description: "新作の限定ボイス作品を公開しました。作品説明と購入ページへの導線確認用です。",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    externalUrl: "https://example.com/ad/5",
    tags: ["ボイス", "新作"]
  },
  {
    title: "SNSヘッダー制作受付中",
    description: "SNSヘッダーや告知画像の制作受付ページです。画像なし広告でも成立するかを確認するためのダミーです。",
    imageUrl: null,
    externalUrl: "https://example.com/ad/6",
    tags: ["デザイン", "依頼受付"]
  },
  {
    title: "新作グッズ受注開始",
    description: "アクリルキーホルダーやポストカードなどの新作グッズ受注ページです。受注受付への遷移を想定しています。",
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80",
    externalUrl: "https://example.com/ad/7",
    tags: ["グッズ", "受注"]
  },
  {
    title: "ショートアニメ公開",
    description: "短編アニメの公開ページです。外部動画ページへの遷移前に、詳細モーダルで概要を見せる想定です。",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    externalUrl: "https://example.com/ad/8",
    tags: ["アニメ", "動画"]
  },
  {
    title: "依頼受付スケジュール更新",
    description: "今月の依頼受付スケジュールを更新しました。画像なしでも一覧で違和感が強くならないかを確認するダミー広告です。",
    imageUrl: null,
    externalUrl: "https://example.com/ad/9",
    tags: ["スケジュール", "依頼受付"]
  },
  {
    title: "写真集サンプル掲載",
    description: "新作写真集のサンプルを掲載しています。作品詳細をモーダルで見たあと、外部ページへ遷移する導線確認用です。",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
    externalUrl: "https://example.com/ad/10",
    tags: ["写真", "サンプル"]
  }
];

export async function seedAds() {
  for (const ad of sampleAds) {
    await addDoc(collection(db, "ads"), {
      ...ad,
      createdAt: serverTimestamp(),
    });
  }
}
```

---

## 実施手順

1. `ads` コレクションに上記10件を投入する
2. 全件に `createdAt: serverTimestamp()` を付ける
3. `localhost:3000` を開く
4. 一覧表示を確認する
5. 画像あり・画像なしが混在しても崩れないか確認する
6. 任意のカードを押してモーダル表示を確認する
7. 外部リンクボタンで遷移確認する

---

## 実装上の注意

* `createdAt` は必須
* `createdAt` は手入力しない
* `imageUrl` がないものは `null`
* `externalUrl` は空にしない
* テスト後に重複投入しないよう注意する

---

## 誰が何をするか

* **Antigravity**

  * サンプルデータ投入を実施
  * 画面表示確認まで進める
* **Aki**

  * 投入後の画面を確認する
* **PM**

  * この工程完了後、次工程へ進めるか判断する
* **CTO**

  * データ投入内容と確認条件を固定する

---

## CTO判断

この段階では、投稿機能へ進む前に、実データで表示導線が成立するかを確認するのが最優先。

そのため今回は以下で進める。

* `ads` に10件投入
* 画像あり7件、画像なし3件
* `createdAt` は server timestamp
* 一覧 / モーダル / 外部リンク を確認

これが終われば、次に進める。
