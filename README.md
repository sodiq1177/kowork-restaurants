# CoWork - Restaurant Review Website

**飲食店情報口コミサイト (Restaurant Review Website)**

A multilingual restaurant review platform for discovering and reviewing restaurants in Uzbekistan.

## Features

- 🔐 **Authentication** - Register, login, logout with NextAuth.js
- 🍽️ **Restaurant CRUD** - Create, read, update, delete restaurants
- 🔍 **Search & Filter** - By name, category, rating, price level
- ⭐ **Review System** - Rate and review restaurants (1-5 stars)
- 🌍 **Multilingual** - English, O'zbek, Русский, 日本語
- 🗺️ **Interactive Maps** - Leaflet + OpenStreetMap integration
- 📸 **Image Upload** - Cloudinary integration
- 👑 **Admin Panel** - Manage users, restaurants, and reviews

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Auth.js (NextAuth v5)
- **i18n:** next-intl
- **Maps:** Leaflet + React Leaflet
- **Image Upload:** Cloudinary
- **Form Validation:** Zod + React Hook Form
- **Icons:** Lucide React

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kowork_db"
AUTH_SECRET="your-secret-key"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Setup Database

```bash
pnpm db:push
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── page.tsx        # Homepage
│   │   ├── restaurants/    # Restaurant pages
│   │   ├── login/          # Login page
│   │   └── register/       # Register page
│   └── api/                # API routes
│       ├── auth/           # Authentication
│       ├── restaurants/    # Restaurant CRUD
│       └── reviews/        # Review CRUD
├── components/             # React components
├── lib/                    # Utilities (Prisma, Auth)
└── i18n/                   # Internationalization config

messages/                   # Translation files
prisma/                     # Database schema
```

## Available Languages

- 🇬🇧 English (`/en`)
- 🇺🇿 O'zbekcha (`/uz`)
- 🇷🇺 Русский (`/ru`)
- 🇯🇵 日本語 (`/ja`)

## Demo Features

1. **Homepage** - Hero section with search
2. **Restaurant List** - Search, filter by category/rating/price
3. **Restaurant Detail** - Info, images, map, reviews
4. **Add Review** - Rate 1-5 stars with comment
5. **Authentication** - Register and login
6. **Admin Panel** - Manage content
7. **Multilingual** - Switch between 4 languages

## License

MIT

## CoWork Project Deliverables

- ① 企画書 (Project Proposal)
- ② 設計書 (Design Document)
- ③ 作業スケジュール (Work Schedule)
- ④ ソースコード (Source Code)
- ⑤ デモサイトURL (Demo Site URL)
- ⑥ テスト仕様書 (Test Specification)
- ⑦ 作業報告書 (Work Report)
- ⑧ プレゼンテーション資料 (Presentation)

**Deadline:** August 31, 2026 14:00
**Presentation:** September 2026 (Week 1)
