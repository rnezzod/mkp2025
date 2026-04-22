import { NextRequest, NextResponse } from 'next/server';

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const API_KEY = process.env.MICROCMS_API_KEY;
const ENDPOINT = process.env.MICROCMS_ENDPOINT;

export async function POST(request: NextRequest) {
  if (!SERVICE_DOMAIN || !API_KEY || !ENDPOINT) {
    return NextResponse.json(
      { error: 'microCMS の環境変数が設定されていません' },
      { status: 500 }
    );
  }

  let body: { id?: string; characters?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '不正なJSON' }, { status: 400 });
  }

  const { id, characters } = body;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'id は必須です' }, { status: 400 });
  }
  if (!Array.isArray(characters) || !characters.every((c) => typeof c === 'string')) {
    return NextResponse.json(
      { error: 'characters は文字列配列である必要があります' },
      { status: 400 }
    );
  }

  const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}/${encodeURIComponent(id)}`;
  // microCMS の repeater 型カスタムフィールドは各要素に fieldId が必須
  const payload = {
    characters: characters.map((name) => ({ fieldId: 'name', name })),
  };

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-MICROCMS-API-KEY': API_KEY,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: `microCMS 更新失敗: ${res.status} ${text}` },
      { status: 502 }
    );
  }

  const data = await res.json().catch(() => ({}));
  return NextResponse.json({ ok: true, data });
}
