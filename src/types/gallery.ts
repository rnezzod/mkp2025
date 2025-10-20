// microCMSのギャラリーデータの型定義

export interface Image {
  url: string;
}

export interface Character {
  name: string;
}

export interface GalleryPost {
  id: string;
  tweet_url: string;
  text: string;
  created_at: string;
  images: Image[];
  likes: number;
  characters: Character[];
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

