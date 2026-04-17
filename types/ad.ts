import { Timestamp, FieldValue } from 'firebase/firestore';

export interface Ad {
  id?: string;
  title: string;          // 必須
  externalUrl: string;    // 必須
  description?: string;   // 任意
  imageUrl?: string;      // 任意
  hasImage: boolean;      // 画像の有無
  tags?: string[];        // 任意
  testMode?: boolean;      // テスト投稿フラグ
  source?: string;         // 投稿ソース識別
  ownerUid?: string;       // 投稿者UID
  ownerEmail?: string;     // 投稿者メール
  ownerDisplayName?: string; // 投稿者表示名
  // 固定パラメータ
  adType: 'self';         // 固定: "self"
  status: 'published';    // 固定: "published"
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}
