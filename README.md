# CoWork - Restaurant Review Website

A multilingual restaurant review platform for discovering, rating, and managing restaurants in Uzbekistan.

## Features

- 🔐 Authentication with NextAuth credentials login/register
- 🍽️ Restaurant creation, listing, detail page, deletion, and owner-only edit logic
- 🔍 Search by text, category, address, and rating filters
- ⭐ Review creation and rating system
- 🌍 4-language interface: English, Uzbek, Russian, Japanese
- 🗺️ OpenStreetMap-based nearby search and coordinates on the map
- 📸 Restaurant image support
- 👑 Admin panel for user and restaurant management
- ❤️ Favorites and nearby restaurant discovery

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Database: SQLite (Prisma)
- Authentication: Auth.js (NextAuth v5)
- i18n: next-intl
- Maps: OpenStreetMap + Yandex-compatible geocoding utilities
- Image hosting: Cloudinary-ready
- Validation: Zod

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and update the values as needed:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-key"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_YANDEX_MAPS_API_KEY="your-yandex-key"
```

### 3. Initialize the database

```bash
npx prisma db push
```

### 4. Run the app

```bash
npm run dev
```

Open http://localhost:3000

## Notes

- The project uses SQLite for local development and Prisma migrations.
- Nearby and address search rely on OpenStreetMap Overpass/Nominatim endpoints.
- Image uploads are supported through Cloudinary, but the app still works without a live upload key for basic browsing and review flows.
- If a stale `.next` cache causes type-checking issues, clear it with:

```bash
rm -rf .next
npx next build
```

## Project Structure

```text
src/
├── app/
│   ├── [locale]/
│   ├── api/
│   └── globals.css
├── components/
├── lib/
├── i18n/
├── proxy.ts
└──
messages/
prisma/
public/
```

## Available Languages

- English (`/en`)
- O'zbek (`/uz`)
- Русский (`/ru`)
- 日本語 (`/ja`)

## Verification

The project has been verified with:

```bash
npx next build
npx prisma db push
```

Both commands succeed in the current project state.
