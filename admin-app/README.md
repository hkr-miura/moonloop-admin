# MOON LOOP 管理システム

**MOON LOOP** カフェ予約管理ダッシュボード。
Next.js と Google Workspace を活用した、モダンでアクセシブルな予約・イベント・顧客フィードバック管理Webアプリケーションです。

## 🚀 機能一覧

- **ダッシュボード**: 直近の予約状況やKPI（来客数予測）をリアルタイムで可視化します。
- **予約管理**:
  - 予約一覧の表示（フィルタリング・ソート機能）。
  - ステータス更新（有効、キャンセル、完了）。
  - キーボード操作に完全対応したUI（ユニバーサルデザイン）。
- **イベント管理**:
  - 新規イベントの作成（`/events`）。
  - **自動化**: イベントごとに専用のGoogleフォームを自動生成し、スプレッドシートと連携させます。
- **予約変更リクエスト**:
  - ユーザーからの日程変更依頼を管理（`/changes`）。
  - 「変更前 vs 変更後」の比較ビュー機能。
  - 承認ボタン一つで、元の予約情報を自動更新し、リクエストを完了状態にします。
- **フォーム選択肢の自動同期**:
  - 通常予約フォームの「日付選択肢」を自動メンテナンス（`/settings`）。
  - 登録済みイベントの日付を自動的に除外し、常に最新の予約可能日（月曜）を表示します。
- **データ可視化**:
  - 月次カレンダービュー（`/calendar`）。
  - Recharts を使用した来客数推移グラフ。
- **ご意見箱**:
  - 顧客からのフィードバックを一覧表示（`/opinions`）。
- **アクセシビリティ**:
  - VoiceOver（スクリーンリーダー）への最適化（セマンティックHTML、ARIAラベル）。
  - ハイコントラストおよびグラスモーフィズムを取り入れた視認性の高いデザイン。

## 🛠 技術スタック

- **フレームワーク**: [Next.js 15+](https://nextjs.org/) (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS, Lucide React (Icons), Shadcn UI (Components)
- **バックエンド / DB**: Google Sheets API, Google Forms API
- **認証**: Google Service Account

## 📂 ドキュメント

- **[DEPLOY.md](./DEPLOY.md)**: Vercelへのデプロイ手順（英語）。
- **[VERIFICATION_MANUAL.md](./VERIFICATION_MANUAL.md)**: 本番環境での手動テスト手順書（英語）。

## 📦 セットアップ & インストール

1.  **リポジトリのクローン**:
    ```bash
    git clone https://github.com/hkr-miura/moonloop-admin.git
    cd moonloop-admin/admin-app
    ```

2.  **依存関係のインストール**:
    ```bash
    npm install
    ```

3.  **環境変数の設定**:
    `admin-app` のルートに `.env.local` ファイルを作成し、以下の変数を設定してください:
    ```env
    # Google Drive & Sheets
    GOOGLE_DRIVE_FOLDER_ID=...
    NORMAL_RESERVATION_SHEET_ID=...
    EVENT_RESERVATION_SHEET_ID=...
    CHANGE_RESERVATION_SHEET_ID=...
    OPINION_BOX_SHEET_ID=...

    # Google Forms
    NORMAL_RESERVATION_FORM_ID=...
    # ... その他フォームID

    # Service Account
    GOOGLE_CLIENT_EMAIL=...
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
    ```

4.  **開発サーバーの起動**:
    ```bash
    npm run dev
    ```
    ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 🚢 デプロイ

Vercelへのデプロイ手順については、[DEPLOY.md](./DEPLOY.md) を参照してください。

## 🧩 スクリプト

- `npm run dev`: 開発サーバーを起動。
- `npm run build`: 本番用ビルドを実行。
- `npm run start`: 本番サーバーを起動。
- `npx tsx scripts/init_resources.ts`: (初回のみ) 必要なGoogle Driveフォルダやスプレッドシートを一括生成します。

---
© Miyahara & Team Antigravity
