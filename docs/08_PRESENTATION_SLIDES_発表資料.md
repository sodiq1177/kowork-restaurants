# 報告会用プレゼンテーション資料 (Final Presentation Slides & Script)

**プロジェクト名**: CoWork Restaurant Portal  
**発表者**: Sodiq  
**発表時間想定**: 10分 ～ 15分  

---

## 📑 スライド構成一覧 (Slide Overview)

- **Slide 1**: 表紙・タイトル (Title & Introduction)
- **Slide 2**: プロジェクトの目的 (Project Goal)
- **Slide 3**: 解決する課題とソリューション (Problem & Solution)
- **Slide 4**: システムアーキテクチャ (System Architecture)
- **Slide 5**: データベース設計 & ER図 (Database Design & ER Diagram)
- **Slide 6**: 主要機能一覧 (Core Features Overview)
- **Slide 7**: 4言語対応機能 (Multilingual 4-Language System: UZ / EN / RU / JA)
- **Slide 8**: 管理者ダッシュボード機能 (Admin Panel & Moderation)
- **Slide 9**: 実機デモ紹介 (Search, Interactive Map, Reviews & Nearby)
- **Slide 10**: テスト実施結果 (Test Specification & Results: 100% Pass)
- **Slide 11**: 本プロジェクトを通じた学び (Key Learnings & Growth)
- **Slide 12**: CoWork成果と今後の展望・結び (CoWork Achievements & Q&A)

---

### ═══════════════════════════════════════════
### Slide 1: 表紙 (Title Slide)
### ═══════════════════════════════════════════
# 🍽️ CoWork Restaurant Portal
### 多言語対応型 スマート・レストラン検索＆レビューシステム
**発表者**: Sodiq  
**所属**: 大学・CoWorkプロジェクト  
**Demo URL**: `https://kowork-restaurants.vercel.app`  

> **発表原稿 (Speech Script)**:
> 「皆様、こんにちは。本日ご紹介するプロジェクトは『CoWork Restaurant Portal』です。外国人観光客や現地住民がタシュケント市内の素晴らしいレストランを、言語の壁なく簡単に見つけ、レビューや地図を確認できる最新のWebプラットフォームです。それでは発表を開始いたします。」

---

### ═══════════════════════════════════════════
### Slide 2: プロジェクトの目的 (Project Goal)
### ═══════════════════════════════════════════
### 🎯 開発の目的
1. **多言語による情報アクセスの民主化**: 外国人（英語・日本語話者）も現地言語が分からなくてもスムーズに飲食情報を取得可能にする。
2. **高精度な位置情報ナビゲーション**: Yandex MapsとGPSを活用し、迷わず店舗へ誘導する。
3. **信頼性のあるユーザーコミュニティの形成**: 5段階評価・写真・口コミによるリアルな情報共有。

---

### ═══════════════════════════════════════════
### Slide 3: 課題と解決策 (Problem & Solution)
### ═══════════════════════════════════════════
| 既存の課題 (Problem) | 本システムの解決策 (Solution) |
|---------------------|-------------------------------|
| 現地情報がウズベク語/ロシア語に偏り、外国人観光客が困惑 | **日本語・英語・ロシア語・ウズベク語の4言語完全対応** |
| レストランの正確な場所や現在地からの距離が分かりにくい | **Yandex Maps API連携 & GPS周辺検索 (Nearby)** |
| 口コミの信頼性や写真の品質が低い | **認証済みユーザーによる星評価 & 高解像度写真ギャラリー** |

---

### ═══════════════════════════════════════════
### Slide 4: システムアーキテクチャ (System Architecture)
### ═══════════════════════════════════════════
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, `next-intl`
- **Backend**: Next.js Route Handlers (RESTful API), NextAuth v5 (Auth.js)
- **Database**: PostgreSQL (Neon Cloud Serverless) + Prisma ORM
- **Hosting / Infra**: Vercel Serverless Edge Platform (Global CDN, SSL)
- **External APIs**: Yandex Maps API, Unsplash HD CDN

---

### ═══════════════════════════════════════════
### Slide 5: データベース設計・ER図 (Database ER Diagram)
### ═══════════════════════════════════════════
- **User**: ユーザー情報、暗号化パスワード、ロール (`ADMIN` / `USER`)
- **Restaurant**: 店舗名、説明、料理カテゴリ、住所、営業時間、緯度経度、平均評価
- **RestaurantImage**: 高解像度写真のURLリレーション
- **Review**: 星評価 (1-5)、コメント、投稿者・店舗FK
- **HelpfulVote**: レビューに対する「役立った」投票
- **Favorite**: ユーザー別お気に入りリスト

---

### ═══════════════════════════════════════════
### Slide 6: 主要機能一覧 (Core Features)
### ═══════════════════════════════════════════
1. 🔍 **リアルタイム検索 & 多彩なフィルター** (料理カテゴリ、価格帯、キーワード)
2. 🗺️ **Yandex Maps & GPS周辺検索** (現在地から近い順ソート)
3. ⭐ **口コミ投稿・星評価・役立ち度投票**
4. ❤️ **お気に入り保存機能** (マイページ連動)
5. 🔐 **セキュアな認証機能** (NextAuth v5 JWT)
6. 📊 **管理者専用ダッシュボード** (店舗CRUD、レビュー管理)

---

### ═══════════════════════════════════════════
### Slide 7: 4言語対応機能 (4-Language System)
### ═══════════════════════════════════════════
- **対応言語**: 🇺🇿 O'zbekcha / 🇬🇧 English / 🇷🇺 Русский / 🇯🇵 日本語
- **技術的特長**:
  - `next-intl` によるURLパス同期 (`/[locale]/...`)
  - SSR（サーバーサイドレンダリング）による高速な言語切替とSEO最適化
  - 辞書JSONファイルによる保守性の高い翻訳管理

---

### ═══════════════════════════════════════════
### Slide 8: 管理者機能 (Admin Dashboard)
### ═══════════════════════════════════════════
- **厳格なロールベース認可 (RBAC)**: 管理者権限（Role: ADMIN）のみがアクセス可能。
- **店舗マネジメント**: レストランの新規追加、写真URL設定、情報更新、削除。
- **モデレーション**: 不適切な口コミの確認・削除。
- **ユーザー管理**: 登録ユーザー一覧と権限ステータスの確認。

---

### ═══════════════════════════════════════════
### Slide 9: 実機デモ (Live Demo Showcase)
### ═══════════════════════════════════════════
- **本番サイト**: [https://kowork-restaurants.vercel.app](https://kowork-restaurants.vercel.app)
- **デモ手順**:
  1. トップ画面から言語を「日本語」に切り替え
  2. "Uzbek" や "Italian" カテゴリでレストランをフィルタリング
  3. 店舗詳細ページで地図と写真ギャラリー、レビューを確認
  4. ログイン後、新規レビューを投稿 → 平均評価が即時更新される様子を実演
  5. `/nearby` で現在地からの距離順表示を実演

---

### ═══════════════════════════════════════════
### Slide 10: テスト結果 (Test Results: 100% Pass)
### ═══════════════════════════════════════════
- **全12項目のテストケース実施**: 合格率 **100% (12/12 PASS)**
- **主要検証項目**:
  - 多言語切替・URL整合性 ✅
  - PostgreSQLトランザクション & Prismaリレーション整合性 ✅
  - NextAuth認証・ルート保護 ✅
  - Next.js 16 Production Build (エラー 0件) ✅

---

### ═══════════════════════════════════════════
### Slide 11: 本プロジェクトでの学び (Key Learnings)
### ═══════════════════════════════════════════
1. **Next.js 16 App Routerの実践力**: Server Componentsによる高パフォーマンス設計。
2. **クラウドデータベース運用**: Neon PostgreSQLによるサーバーレス接続とマイグレーション。
3. **Webセキュリティの基礎**: パスワードハッシュ化、JWTセッション、RBAC保護。
4. **UI/UXデザイン思考**: Glassmorphismとレスポンシブデザインによるユーザー体験の向上。

---

### ═══════════════════════════════════════════
### Slide 12: CoWork成果と結び (Conclusion & Q&A)
### ═══════════════════════════════════════════
- **まとめ**: 
  - 企画から本番公開までを一貫して完遂し、実用的かつ高品質なWebサービスを完成させました。
- **公開リンク**: [https://kowork-restaurants.vercel.app](https://kowork-restaurants.vercel.app)
- **GitHub**: [https://github.com/sodiq1177/kowork-restaurants](https://github.com/sodiq1177/kowork-restaurants)

**ご清聴ありがとうございました。質疑応答 (Q&A) に移らせていただきます。**
