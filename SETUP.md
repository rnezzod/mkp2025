# ギャラリーサイト セットアップガイド

## 環境変数の設定

プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
MICROCMS_SERVICE_DOMAIN=あなたのサービス名
MICROCMS_API_KEY=あなたのAPIキー
MICROCMS_ENDPOINT=gallery2024
```

### 環境変数の取得方法

1. microCMSの管理画面にログイン
2. 「API設定」から以下の情報を確認：
   - **サービスドメイン**: `your-service-name.microcms.io` の `your-service-name` 部分
   - **APIキー**: 「APIキー」タブから取得できます

## 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 機能

### ✨ 実装済み機能

- **Twitterライクなギャラリーレイアウト**: カード形式でポストを表示
- **画像グリッド表示**: 1〜4枚の画像を最適なレイアウトで表示
- **キャラクターフィルター**: ドロップダウンメニューからキャラクターで絞り込み
- **ツイートへのリンク**: 画像またはリンクをクリックで元のポストに遷移
- **いいね数の表示**: 各ポストのいいね数を表示
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応
- **ダークモード対応**: システム設定に従って自動的に切り替え

### 📱 レイアウト

- **1枚の画像**: 横長レイアウト
- **2枚の画像**: 2列グリッド
- **3枚の画像**: 1枚目が横長、2〜3枚目が正方形
- **4枚の画像**: 2x2グリッド

## microCMS スキーマ設定

エンドポイント名: `gallery2024`

### APIフィールド

- `tweet_url` (テキスト、必須): ポストURL
- `text` (テキスト、必須): ポスト文
- `created_at` (日時、必須): ポスト日時
- `images` (繰り返し、任意): 画像のURLたち
  - `url` (テキスト): 画像URL
- `likes` (数値、必須): いいね数
- `characters` (繰り返し、任意): キャラクター
  - `name` (テキスト): 名前

## トラブルシューティング

### エラー: "MICROCMS_SERVICE_DOMAIN is not defined"

`.env.local` ファイルが正しく作成されているか確認してください。

### 画像が表示されない

Next.jsの画像最適化を使用しているため、外部ドメインからの画像を表示する場合は `next.config.ts` に設定が必要な場合があります：

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
    ],
  },
};
```

