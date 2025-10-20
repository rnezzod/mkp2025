# Vercelデプロイ手順

## 1. Gitユーザー情報を設定（初回のみ）

```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

## 2. GitHubリポジトリにプッシュ

```bash
# コミット
git add .
git commit -m "Initial commit: Gallery site with microCMS"

# GitHubリポジトリと接続（GitHubで作成したリポジトリのURLを使用）
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

## 3. Vercelでデプロイ

1. https://vercel.com にアクセス
2. 「Sign Up」または「Log In」（GitHubアカウントでログイン推奨）
3. 「Add New...」→「Project」をクリック
4. GitHubリポジトリをインポート
5. プロジェクト設定で「Environment Variables」に以下を追加：

```
MICROCMS_SERVICE_DOMAIN=MKP2025
MICROCMS_API_KEY=md3W5nl5tjlB7WPv4RhGndLNbuUGM6GilXbE
MICROCMS_ENDPOINT=gallery2024
```

6. 「Deploy」をクリック

## 4. デプロイ完了！

数分でデプロイが完了し、URLが発行されます（例：`https://your-project.vercel.app`）

## 以降の更新

コードを変更してGitHubにプッシュすると、自動的にVercelが再デプロイします：

```bash
git add .
git commit -m "Update: 変更内容の説明"
git push
```

## トラブルシューティング

### ビルドエラーが出る場合
- 環境変数が正しく設定されているか確認
- Vercelのログを確認

### 画像が表示されない場合
- `next.config.ts`の`remotePatterns`設定を確認
- すでに設定済みなので問題ないはずです

