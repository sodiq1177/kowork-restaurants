# 設計書 (Design Document)

**プロジェクト名**: CoWork Restaurant Portal  
**文書種別**: システム基本設計書・詳細設計書  
**作成者**: Sodiq  
**バージョン**: 2.0 (PostgreSQL & Vercel Cloud Edition)  

---

## 1. システムアーキテクチャ (System Architecture)

```mermaid
flowchart TB
    subgraph Client["クライアント層 (Client Layer)"]
        Browser["Web Browser (PC / Mobile)"]
    end

    subgraph CDN_Vercel["Vercel Edge & Serverless Layer"]
        NextRouting["Next.js App Router (Middleware / i18n)"]
        NextServer["Next.js SSR & Server Components"]
        APIHandlers["API Route Handlers (/api/*)"]
        AuthModule["NextAuth v5 (JWT & Role Guards)"]
    end

    subgraph ExternalServices["外部サービス連携 (External Services)"]
        YandexMap["Yandex Maps API (Geocoding & Maps)"]
        UnsplashCDN["Unsplash HD Image CDN"]
    end

    subgraph DatabaseLayer["クラウドデータベース層 (Database Layer)"]
        PrismaORM["Prisma ORM (Type-Safe Client)"]
        NeonDB[("Neon PostgreSQL Serverless (AWS us-east-2)")]
    end

    Browser --> NextRouting
    NextRouting --> NextServer
    NextRouting --> APIHandlers
    NextServer --> AuthModule
    APIHandlers --> AuthModule
    NextServer --> UnsplashCDN
    Browser --> YandexMap
    APIHandlers --> PrismaORM
    NextServer --> PrismaORM
    PrismaORM --> NeonDB
```

---

## 2. データベース物理設計・ER図 (Database ER Diagram)

```mermaid
erDiagram
    User ||--o{ Review : "writes"
    User ||--o{ Favorite : "saves"
    User ||--o{ Restaurant : "creates (Admin)"
    Restaurant ||--o{ Review : "receives"
    Restaurant ||--o{ Favorite : "has"
    Restaurant ||--o{ RestaurantImage : "contains"
    Review ||--o{ HelpfulVote : "gets"

    User {
        String id PK
        String name
        String email UK
        String password
        Role role "USER | ADMIN"
        DateTime createdAt
        DateTime updatedAt
    }

    Restaurant {
        String id PK
        String name
        String description
        String category "Uzbek, Italian, Japanese, Fast Food, etc."
        String address
        String phone
        String openingHours
        PriceLevel priceLevel "BUDGET | MODERATE | EXPENSIVE | LUXURY"
        Float latitude
        Float longitude
        Float avgRating
        Int reviewCount
        String createdById FK
        DateTime createdAt
        DateTime updatedAt
    }

    RestaurantImage {
        String id PK
        String url
        String publicId
        String restaurantId FK
        DateTime createdAt
    }

    Review {
        String id PK
        Int rating "1 to 5"
        String comment
        Int helpfulCount
        String userId FK
        String restaurantId FK
        DateTime createdAt
        DateTime updatedAt
    }

    HelpfulVote {
        String id PK
        String userId FK
        String reviewId FK
        DateTime createdAt
    }

    Favorite {
        String id PK
        String userId FK
        String restaurantId FK
        DateTime createdAt
    }
```

---

## 3. 画面設計・UI/UXレイアウト (UI/UX Design)

| 画面名 | パス (URL) | 主な構成要素と機能 |
|--------|------------|-------------------|
| **トップ画面 (Home)** | `/[locale]/` | ヒーローセクション、リアルタイムキーワード検索、人気カテゴリカルーセル、おすすめレストランカード、統計カウンター |
| **レストラン一覧 (Explore)** | `/[locale]/restaurants` | カテゴリフィルター、価格帯フィルター、ソート（評価順・新着順）、グリッドカード、ページネーション |
| **レストラン詳細 (Detail)** | `/[locale]/restaurants/[id]` | 写真ギャラリー、店舗基本情報（営業時間・電話・住所）、Yandex Maps埋め込み、星評価付きレビュー一覧、口コミ投稿フォーム |
| **周辺検索 (Nearby)** | `/[locale]/nearby` | ブラウザGPSによる現在地測位、半径5km/10km以内のレストラン距離順ソート表示 |
| **お気に入り (Favorites)** | `/[locale]/favorites` | ログインユーザーが保存したレストラン一覧、1クリック削除機能 |
| **ユーザー認証 (Auth)** | `/[locale]/login`, `/register` | バリデーション付きサインアップ・サインイン、パスワード暗号化（bcryptjs） |
| **マイページ (Profile)** | `/[locale]/profile` | ユーザー情報表示、投稿したレビュー履歴一覧 |
| **管理者ダッシュボード (Admin)** | `/[locale]/admin` | レストラン追加・編集・削除、全レビューのモデレーション、ユーザー権限管理 |

---

## 4. RESTful API インターフェース設計 (API Specification)

| メソッド | エンドポイント | 説明 | 認証要否 |
|---------|----------------|------|----------|
| `GET` | `/api/restaurants` | レストラン一覧取得（検索・カテゴリ・価格フィルタ） | 不要 |
| `POST` | `/api/restaurants` | 新規レストラン登録 | Admin必須 |
| `GET` | `/api/restaurants/[id]` | レストラン詳細データ取得 | 不要 |
| `PUT` | `/api/restaurants/[id]` | レストラン情報更新 | Admin必須 |
| `DELETE` | `/api/restaurants/[id]` | レストラン削除 | Admin必須 |
| `GET` | `/api/restaurants/nearby` | 緯度・経度パラメータによる近隣店舗検索 | 不要 |
| `POST` | `/api/reviews` | レビュー新規投稿 | ログイン必須 |
| `DELETE` | `/api/reviews/[id]` | レビュー削除 | 本人またはAdmin |
| `POST` | `/api/reviews/[id]/helpful` | レビューへの「役立った」投票トグル | ログイン必須 |
| `GET` | `/api/favorites` | ログイン中ユーザーのお気に入り取得 | ログイン必須 |
| `POST` | `/api/favorites` | お気に入り追加/解除トグル | ログイン必須 |
| `POST` | `/api/auth/register` | 新規ユーザー登録（パスワードハッシュ化） | 不要 |
| `GET` | `/api/admin/users` | 登録ユーザー一覧取得 | Admin必須 |
