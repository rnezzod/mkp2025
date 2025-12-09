import { createClient } from 'microcms-js-sdk';
import type { GalleryResponse } from '@/types/gallery';

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
  });

  return response;
}

// 固定リストを使用するため廃止
// export async function getAllCharacters(): Promise<string[]> { ... }
