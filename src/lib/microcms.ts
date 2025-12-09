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

export async function getGalleryPosts(
  page: number = 1,
  limit: number = 18,
  filters?: string,
  orders: string = '-created_at',
  q?: string
): Promise<GalleryResponse> {
  const offset = (page - 1) * limit;

  const response = await client.get<GalleryResponse>({
    endpoint: ENDPOINT,
    queries: {
      filters,
      orders,
      limit,
      offset,
      q,
    },
    customRequestInit: {
      cache: 'no-store',
    },
  });

  return response;
}

// 全件取得してメモリ上でフィルタリングするための関数
// 常にキャッシュ無効化 (no-store)
export async function getAllGalleryPosts(): Promise<GalleryPost[]> {
  const limit = 100; // 1回あたりの最大取得件数
  let offset = 0;
  let allContents: GalleryPost[] = [];
  
  // 常にキャッシュ無効化
  const fetchOptions = { cache: 'no-store' as RequestCache };

  // 初回リクエストで総数を取得
  const firstResponse = await client.get<GalleryResponse>({
    endpoint: ENDPOINT,
    queries: {
      limit,
      offset: 0,
      fields: 'id,created_at,tweet_url,user,image,characters', // 必要なフィールドのみ取得
      orders: '-created_at',
    },
    customRequestInit: fetchOptions
  });

  allContents = [...firstResponse.contents];
  const totalCount = firstResponse.totalCount;

  if (totalCount <= limit) {
    return allContents;
  }

  // 残りのデータを並列取得
  const promises = [];
  for (offset = limit; offset < totalCount; offset += limit) {
    promises.push(
      client.get<GalleryResponse>({
        endpoint: ENDPOINT,
        queries: {
          limit,
          offset,
          fields: 'id,created_at,tweet_url,user,image,characters',
          orders: '-created_at',
        },
        customRequestInit: fetchOptions
      })
    );
  }

  const responses = await Promise.all(promises);
  responses.forEach(res => {
    allContents = [...allContents, ...res.contents];
  });

  return allContents;
}
