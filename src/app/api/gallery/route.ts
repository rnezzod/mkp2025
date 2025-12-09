import { NextRequest, NextResponse } from 'next/server';
import { getAllGalleryPosts } from '@/lib/microcms';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '18', 10);
    const charactersParam = searchParams.get('characters');
    const characters = charactersParam ? charactersParam.split(',').filter(Boolean) : [];
    const sort = searchParams.get('sort') || 'newest';
    const refresh = searchParams.get('refresh') === 'true';
    
    // 全件データを取得（キャッシュ有効、refresh=trueの場合は無効）
    let allPosts = await getAllGalleryPosts(refresh);

    // フィルタリング (AND検索)
    if (characters.length > 0) {
      allPosts = allPosts.filter(post => {
        if (!post.characters || post.characters.length === 0) return false;
        // 投稿に含まれるキャラクター名のリストを作成
        const postCharNames = post.characters.map(c => c.name);
        // 選択されたキャラクターの全て（AND）が含まれているかチェック
        return characters.every(char => postCharNames.includes(char));
      });
    } else {
        // キャラクター指定がない場合も、キャラクターが設定されている記事のみを表示する
        allPosts = allPosts.filter(post => post.characters && post.characters.length > 0);
    }

    // ソート
    if (sort === 'oldest') {
        allPosts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
        // デフォルトはnewest（microCMSから取得時点でnewestだが、並列取得で順序が崩れる可能性もあるため再ソート）
        allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // ページネーション
    const totalCount = allPosts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      posts: paginatedPosts,
      totalCount: totalCount,
    }, {
      headers: {
        // クライアント側でのキャッシュは無効化するが、サーバー側ではmicroCMSからのデータをキャッシュしている
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    );
  }
}
