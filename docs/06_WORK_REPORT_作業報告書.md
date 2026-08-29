# 作業報告書 (Work Report)

**プロジェクト名**: CoWork Restaurant Portal  
**作成者**: Sodiq  
**作成日**: 2026年8月29日  
**提出先**: 大学・CoWorkプロジェクト担当教員 / 審査員各位  

---

## 1. 実施作業の概要 (Executive Summary)
本プロジェクトでは、外国人および現地ユーザーの双方にとって最も使いやすいタシュケント市内レストラン検索ポータルを構築することを目的とし、企画・要件定義からフルスタックWeb開発、クラウド移行、テスト、そしてVercelへの本番デプロイまでを一貫して実施いたしました。

---

## 2. 実施フェーズ別作業内容 (Phase Breakdown)

### 第1フェーズ: 要件定義・UI設計
- 多言語（ウズベク語、英語、ロシア語、日本語）に対応する情報設計を策定。
- Tailwind CSSによるGlassmorphism（すりガラス効果）を取り入れたモダンなUIワイヤーフレームを作成。

### 第2フェーズ: データベース設計・バックエンド開発
- Prisma ORMを用いたスキーマ設計（User, Restaurant, RestaurantImage, Review, HelpfulVote, Favorite）。
- NextAuth v5による認証機構とロールベースアクセス制御（Admin / User）の実装。
- Next.js Route HandlersによるRESTful APIエンドポイントの構築。

### 第3フェーズ: フロントエンド・外部API連携
- `next-intl` を導入し、URLルーティングベースの完全な国際化（SSR対応）を実現。
- Yandex Maps APIを組み込み、店舗位置の地図表示およびGPS位置情報による「Nearby（周辺検索）」を実装。
- Unsplash HD画像APIを活用した料理カテゴリ別の美しいフォトギャラリーを構築。

### 第4フェーズ: クラウドDB移行・本番デプロイ
- 開発用ローカルDB（SQLite）から、本番クラウドデータベース（Neon PostgreSQL）への完全移行を実施。
- シードスクリプトを実行し、初期レストランデータおよびレビューデータを投入。
- Vercel Serverless Platformへデプロイし、グローバル公開を完了。

---

## 3. 発生した課題と克服した解決策 (Challenges & Solutions)

| 発生した技術的課題 | 原因 | 解決策 (Action Taken) |
|-------------------|------|----------------------|
| **1. サーバーレス環境でのDB永続化** | SQLiteはサーバーレス環境（Vercel）でファイル保存ができない | クラウドPostgreSQL（Neon）に移行し、Connection Poolerを通じて高耐久・高スループットなDB接続を確立。 |
| **2. Next.js 16 App Routerでの多言語ルーティング** | 静的生成と動的ルーティングの競合 | `next-intl` の最新ミドルウェア設定を適用し、`/[locale]/` パスでSEOに最適化されたルーティングを実現。 |
| **3. ロール別権限制御 (RBAC)** | 一般ユーザーによる管理画面アクセスリスク | NextAuthのJWTトークンにロール（Role: ADMIN）を埋め込み、サーバーコンポーネントおよびAPIミドルウェア双方で多重検証を実施。 |
