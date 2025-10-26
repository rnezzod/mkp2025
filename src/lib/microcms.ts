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

  // カスタムソート関数
  const specialCharacters = [
    'オーナー',
    'ベテランウェイター',
    'ベテランウェイトレス',
    '新人ウェイター',
    '新人ウェイトレス',
    'Poppin\'Roll',
  ];
  
  const charactersArray = Array.from(charactersSet);
  
  return charactersArray.sort((a, b) => {
    const aIsSpecial = specialCharacters.includes(a);
    const bIsSpecial = specialCharacters.includes(b);
    
    // オーナーを1番目に
    if (a === 'オーナー') return -1;
    if (b === 'オーナー') return 1;
    
    // Poppin'Rollを最後に
    if (a === 'Poppin\'Roll') return 1;
    if (b === 'Poppin\'Roll') return -1;
    
    // ウェイター/ウェイトレスを後ろに（Poppin'Rollの前）
    const waiterOrder = ['ベテランウェイター', 'ベテランウェイトレス', '新人ウェイター', '新人ウェイトレス'];
    const aIndex = waiterOrder.indexOf(a);
    const bIndex = waiterOrder.indexOf(b);
    
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return 1; // aを後ろに
    if (bIndex !== -1) return -1; // bを後ろに
    
    // その他（通常のキャラクター）を50音順で前の方に
    if (!aIsSpecial && !bIsSpecial) {
      return a.localeCompare(b, 'ja');
    }
    
    // aが通常、bが特別 → aを前
    if (!aIsSpecial) return -1;
    // aが特別、bが通常 → bを前
    if (!bIsSpecial) return 1;
    
    return 0;
  });
}

