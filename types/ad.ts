import { Timestamp, FieldValue } from 'firebase/firestore';

export interface Ad {
  id?: string;
  title: string;          // 必須
  externalUrl: string;    // 必須
  description?: string;   // 任意
  imageUrl?: string;      // 任意
  tags?: string[];        // 任意
  // 固定パラメータ
  adType: 'self';         // 固定: "self"
  status: 'published';    // 固定: "published"
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}
