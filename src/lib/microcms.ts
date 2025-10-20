import { createClient } from 'microcms-js-sdk';
import type { GalleryResponse, GalleryPost } from '@/types/gallery';

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is not defined');
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is not defined');
}

if (!process.env.MICROCMS_ENDPOINT) {
  throw new Error('MICROCMS_ENDPOINT is not defined');
}

const ENDPOINT = process.env.MICROCMS_ENDPOINT;

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

export async function getGalleryPosts(character?: string): Promise<GalleryResponse> {
  const filters = character ? `characters[contains]${character}` : undefined;
  const limit = 100; // microCMSの1回あたりの最大取得件数
  let offset = 0;
  let allContents: GalleryPost[] = [];
  let totalCount = 0;

  // 全データを取得するまでループ
  while (true) {
    const response = await client.get<GalleryResponse>({
      endpoint: ENDPOINT,
      queries: {
        filters,
        orders: '-created_at',
        limit,
        offset,
      },
    });

    allContents = [...allContents, ...response.contents];
    totalCount = response.totalCount;

    // 全データを取得したら終了
    if (allContents.length >= totalCount) {
      break;
    }

    offset += limit;
  }

  return {
    contents: allContents,
    totalCount,
    offset: 0,
    limit: 100,
  };
}

export async function getAllCharacters(): Promise<string[]> {
  const limit = 100;
  let offset = 0;
  const charactersSet = new Set<string>();
  
  // 全データを取得するまでループ
  while (true) {
    const response = await client.get<GalleryResponse>({
      endpoint: ENDPOINT,
      queries: {
        limit,
        offset,
        fields: 'characters',
      },
    });

    response.contents.forEach((post) => {
      post.characters?.forEach((char) => {
        if (char.name) {
          charactersSet.add(char.name);
        }
      });
    });

    // 全データを取得したら終了
    if (offset + limit >= response.totalCount) {
      break;
    }

    offset += limit;
  }

  return Array.from(charactersSet).sort();
}

