import { NextRequest, NextResponse } from 'next/server';
import { getGalleryPosts } from '@/lib/microcms';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '18', 10);
    const charactersParam = searchParams.get('characters');
    const characters = charactersParam ? charactersParam.split(',').filter(Boolean) : [];
    const sort = searchParams.get('sort') || 'newest';
    
    // sort param to microCMS orders
    const orders = sort === 'oldest' ? 'created_at' : '-created_at';

    // microCMS filter construction
    let q: string | undefined = undefined;
    
    if (characters.length > 0) {
      // 全文検索で代用 (AND検索)
      // microCMSのqパラメータはスペース区切りでAND検索になる
      q = characters.join(' ');
    }
    
    // filtersは一旦使用しない（リピーターフィールド内の検索が難しいため）
    const filters = undefined;

    console.log(`[API Debug] Request params: page=${page}, limit=${limit}, q=${q}, orders=${orders}`);

    const galleryResponse = await getGalleryPosts(page, limit, filters, orders, q);
    
    console.log(`[API Debug] Response count: ${galleryResponse.contents.length}`);

    return NextResponse.json({
      posts: galleryResponse.contents,
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
