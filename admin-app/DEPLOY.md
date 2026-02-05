# デプロイメントガイド (Vercel)

本アプリケーションは Next.js で構築されており、Vercel へのデプロイに最適化されています。

## 前提条件
- Vercel アカウント
- GitHub リポジトリ（Vercelと連携済みであること）
- Google Service Account の認証情報 (JSON)

## デプロイ手順

1.  **GitHubへプッシュ**: 最新のコードが `main` ブランチにプッシュされていることを確認してください。
2.  **Vercelでプロジェクトをインポート**:
    - Vercel ダッシュボードへ移動 -> "Add New..." -> "Project" を選択。
    - 自社のリポジトリを選択します。
3.  **プロジェクト設定**:
    - **Framework Preset**: Next.js (デフォルトのまま)
    - **Root Directory**: `admin-app` (**重要**: アプリケーションがサブディレクトリにあるため、ここを必ず `admin-app` に設定してください)
4.  **環境変数 (Environment Variables)**:
    - ローカルの `.env.local` の内容をすべて Vercel の "Environment Variables" セクションにコピーします。
    - **重要**: `GOOGLE_PRIVATE_KEY` は、`-----BEGIN PRIVATE KEY-----` から始まる全ての文字（改行 `\n` を含む）をそのままコピー＆ペーストしてください。Vercel は改行を正しく処理します。

    **必須環境変数リスト**:
    - `GOOGLE_CLIENT_EMAIL`
    - `GOOGLE_PRIVATE_KEY`
    - `GOOGLE_DRIVE_FOLDER_ID`
    - `NORMAL_RESERVATION_SHEET_ID`
    - `NORMAL_RESERVATION_FORM_ID`
    - `EVENT_RESERVATION_SHEET_ID`
    - `EVENT_RESERVATION_FORM_ID`
    - `CHANGE_RESERVATION_SHEET_ID`
    - `CHANGE_RESERVATION_FORM_ID`
    - `OPINION_BOX_SHEET_ID`
    - `OPINION_BOX_FORM_ID`

5.  **デプロイ**: "Deploy" ボタンをクリックします。
6.  **確認**: 生成された URL にアクセスします。ダッシュボードが表示され、予約件数が読み込まれれば成功です。

## Cronジョブ (フォーム同期の自動化)
イベント日時を除外する「フォーム選択肢同期機能」を自動化する場合：
1.  Vercel Cron Jobs は `vercel.json` (設定が必要) または API エンドポイントへの定期アクセスで実現できます。
2.  **MVP (現段階)** では、管理画面の `/settings` ページから手動で "Run Sync Now" ボタンを押すことで実行可能です。
3.  完全自動化を行う場合は、GitHub Actions や Vercel Cron を設定し、セキュアな API ルートを定期的に叩く仕組みを構築してください。

## トトラブルシューティング
- **APIで 500 エラーが発生する**: Vercel の Logs を確認してください。ほとんどの場合、`GOOGLE_PRIVATE_KEY` のコピーミス（改行が含まれていない、または余計な文字が入っている）が原因です。
- **スプレッドシートが更新されない**: 対象の Google スプレッドシートや Drive フォルダの「共有設定」で、Service Account のメールアドレス (`client_email`) に編集権限が付与されているか再確認してください。
