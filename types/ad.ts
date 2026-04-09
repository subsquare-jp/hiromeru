import { Timestamp } from "firebase/firestore";

export type Ad = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  externalUrl: string;
  tags: string[];
  createdAt: Timestamp;
};
