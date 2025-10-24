// microCMSのギャラリーデータの型定義

export interface ApiField {
  fieldId: string;
  name: string;
  kind: string;
  required: boolean;
  customFieldCreatedAtList?: string[];
}

export interface CustomField {
  createdAt: string;
  fieldId: string;
  name: string;
  fields: Array<{
    idValue: string;
    fieldId: string;
    name: string;
    kind: string;
    required: boolean;
  }>;
  position: string[][];
  updatedAt: string;
  viewerGroup: string;
}

export interface ApiSchema {
  apiFields: ApiField[];
  customFields: CustomField[];
}

export interface Character {
  name: string;
}

export interface GalleryPost {
  id: string;
  tweet_url: string;
  user: string;
  created_at: string;
  image?: string; // 単一の画像URL
  characters?: Character[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
}

export interface GalleryResponse {
  contents: GalleryPost[];
  totalCount: number;
  offset: number;
  limit: number;
}

