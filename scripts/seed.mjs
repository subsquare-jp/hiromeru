import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error(".env.local file not found. Please create it first.");
  process.exit(1);
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check for placeholders
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "xxxx") {
  console.error("Firebase config is missing or contains placeholders in .env.local.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

async function seed() {
  console.log("Starting to seed 10 ads into Firestore...");
  try {
    for (const ad of sampleAds) {
      const docRef = await addDoc(collection(db, "ads"), {
        ...ad,
        createdAt: serverTimestamp(),
      });
      console.log(`Added ad with ID: ${docRef.id} - ${ad.title}`);
    }
    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ads:", error);
    process.exit(1);
  }
}

seed();
