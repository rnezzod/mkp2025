import { NextResponse } from 'next/server';
import { getGalleryPosts, getAllCharacters } from '@/lib/microcms';

export async function GET() {
  try {
    const [galleryResponse, characters] = await Promise.all([
      getGalleryPosts(),
      getAllCharacters(),
    ]);

    return NextResponse.json({
      posts: galleryResponse.contents,
      characters,
      totalCount: galleryResponse.totalCount,
    });
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    );
  }
}

