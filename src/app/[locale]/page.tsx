import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  Sparkles,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
  Heart,
  TrendingUp,
  Compass,
  Award,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getRestaurantImageUrl } from "@/lib/restaurantImages";
import { getOpenStatus } from "@/lib/openNow";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");

  // Fetch popular restaurants with error handling
  type RestaurantWithImages = Prisma.RestaurantGetPayload<{
    include: { images: true; _count: { select: { reviews: true } } };
  }>;
  let popularRestaurants: RestaurantWithImages[] = [];
  try {
    popularRestaurants = await prisma.restaurant.findMany({
      where: { avgRating: { gte: 4.0 } },
      include: {
        images: { take: 2 },
        _count: { select: { reviews: true } },
      },
      orderBy: [{ avgRating: "desc" }, { reviewCount: "desc" }],
      take: 6,
    });
  } catch (error) {
    console.error("Failed to fetch popular restaurants:", error);
    popularRestaurants = [];
  }

  const categories = [
    {
      name: "Uzbek",
      emoji: "🇺🇿",
      title: "Milliy Oshxona",
      description: "Plov, Shashlik, Samsa",
      gradient: "from-amber-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Italian",
      emoji: "🍕",
      title: "Italiya Taomlari",
      description: "Pizza, Pasta, Risotto",
      gradient: "from-emerald-500 to-teal-700",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Japanese",
      emoji: "🍣",
      title: "Yapon Oshxonasi",
      description: "Sushi, Ramen, Sashimi",
      gradient: "from-rose-500 to-red-700",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Korean",
      emoji: "🥩",
      title: "Koreys BBQ",
      description: "Galbi, Kimchi, Bibimbap",
      gradient: "from-indigo-500 to-purple-700",
      image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Fast Food",
      emoji: "🍔",
      title: "Fast Food & Burger",
      description: "Burgers, Fries, Wings",
      gradient: "from-orange-500 to-red-600",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Cafe",
      emoji: "☕",
      title: "Qahva & Shirinliklar",
      description: "Specialty Coffee, Desserts",
      gradient: "from-amber-600 to-yellow-700",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 md:py-36">
        {/* Background Image with Dark Vignette & Gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transform animate-in fade-in duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/40 via-transparent to-amber-950/40" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-orange-400 text-xs md:text-sm font-bold tracking-wide uppercase mb-8 shadow-xl">
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <span>O&apos;zbekistonning Eng Sara Restoranlari & Taomlari</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight mb-6">
            Lazzatli Taomlar & <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              Unutilmas Maskanlar
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            {t("subtitle") || "Yaqin-atrofdagi eng yaxshi restoranlarni toping, taqrizlar o'qing va o'z taassurotlaringiz bilan bo'lishing."}
          </p>

          {/* Search Bar */}
          <form
            action={`/${locale}/restaurants`}
            method="GET"
            className="max-w-3xl mx-auto mb-8"
          >
            <div className="relative p-2 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/50 hover:border-orange-500/50 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center gap-2 bg-white rounded-2xl p-1.5 shadow-inner">
                <div className="flex items-center flex-1 w-full px-4 py-2 text-slate-400">
                  <Search size={22} className="text-orange-500 shrink-0 mr-3" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Restoran nomi, oshxona turi yoki manzil..."
                    className="w-full bg-transparent text-slate-900 text-base md:text-lg placeholder:text-slate-400 focus:outline-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-orange-500/30 cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <Search size={18} />
                  <span>Qidirish</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Cuisine Tags */}
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-slate-300">
            <span className="text-slate-400 font-medium">Mashhur qidiruvlar:</span>
            {["Plov", "Sushi", "Pizza", "Korean BBQ", "Burger", "Coffee"].map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/restaurants?q=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold backdrop-blur-xs transition"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center p-3 border-r border-slate-100 last:border-0">
            <div className="text-3xl md:text-4xl font-black text-orange-600 mb-1">500+</div>
            <div className="text-xs md:text-sm font-semibold text-slate-600">Tekshirilgan Maskonlar</div>
          </div>
          <div className="text-center p-3 md:border-r border-slate-100 last:border-0">
            <div className="text-3xl md:text-4xl font-black text-amber-500 mb-1">12,000+</div>
            <div className="text-xs md:text-sm font-semibold text-slate-600">Haqiqiy Fikrlar</div>
          </div>
          <div className="text-center p-3 border-r border-slate-100 last:border-0">
            <div className="text-3xl md:text-4xl font-black text-rose-500 mb-1">4.9 ★</div>
            <div className="text-xs md:text-sm font-semibold text-slate-600">O&apos;rtacha Baho</div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl md:text-4xl font-black text-emerald-500 mb-1">100%</div>
            <div className="text-xs md:text-sm font-semibold text-slate-600">Ishonchli Manzillar</div>
          </div>
        </div>
      </section>

      {/* Cuisine Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm tracking-wider uppercase mb-2">
              <Compass size={16} />
              <span>Oshxona Turlari</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Ta&apos;bga Mos Oshxonani Tanlang
            </h2>
          </div>
          <Link
            href={`/${locale}/restaurants`}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-orange-600 font-bold text-sm hover:text-orange-700 group"
          >
            <span>Barcha toifalarni ko&apos;rish</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/${locale}/restaurants?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-60"
            >
              {/* Card Image */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition duration-500"
                style={{ backgroundImage: `url('${cat.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Card Badge & Info */}
              <div className="relative p-5 flex flex-col justify-between h-full text-white">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-md border border-white/20">
                  {cat.emoji}
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight leading-snug group-hover:text-amber-300 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-1 font-medium mt-0.5">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Restaurants Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-bold text-sm tracking-wider uppercase mb-2">
              <TrendingUp size={16} />
              <span>Eng Mashhur Joylar</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Mehmonlar E&apos;tirofiga Sazovor Maskonlar
            </h2>
          </div>
          <Link
            href={`/${locale}/restaurants`}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-sm transition"
          >
            <span>Barchasini ko&apos;rish</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularRestaurants.map((restaurant) => {
            const imageUrl = getRestaurantImageUrl({
              id: restaurant.id,
              name: restaurant.name,
              category: restaurant.category,
              images: restaurant.images,
            });
            const openStatus = getOpenStatus(restaurant.openingHours);

            return (
              <Link
                key={restaurant.id}
                href={`/${locale}/restaurants/${restaurant.id}`}
                className="group rounded-3xl bg-white border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1.5 flex flex-col"
              >
                {/* Image & Badges */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <img
                    src={imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold shadow-md">
                      {restaurant.category}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                        openStatus.isOpen
                          ? "bg-emerald-500 text-white"
                          : "bg-rose-500/90 text-white"
                      }`}
                    >
                      {openStatus.isOpen ? "Ochiq • Open" : "Yopiq • Closed"}
                    </span>
                  </div>

                  {/* Bottom Rating on Image */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg">
                    <Star className="text-amber-500 fill-amber-500" size={16} />
                    <span className="text-sm font-black text-slate-900">
                      {restaurant.avgRating.toFixed(1)}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      ({restaurant._count.reviews} ta sharh)
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition line-clamp-1">
                        {restaurant.name}
                      </h3>
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 shrink-0">
                        {restaurant.priceLevel}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 font-normal">
                      {restaurant.description || "Haqiqiy milliy va xalqaro lazzatlar maskani."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 truncate mr-2">
                      <MapPin size={15} className="text-orange-500 shrink-0" />
                      <span className="truncate">{restaurant.address}</span>
                    </div>
                    <span className="font-bold text-orange-600 group-hover:translate-x-0.5 transition shrink-0">
                      Batafsil →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="bg-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Award size={14} />
              <span>Nega Aynan CoWork?</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Restoran Tanlash Endi Juda Oson
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Biz eng ishonchli ma&apos;lumotlar, haqiqiy mehmonlar fikrlari va qulay navigatsiyani birlashtirdik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/60 hover:border-orange-500/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-500/20">
                <Search size={26} />
              </div>
              <h3 className="text-xl font-bold mb-3">Aqlli Qidiruv va Filter</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Taom toifasi, baholash darajasi, narx va eng yaqin masofalar bo&apos;yicha istalgan maskanni bir zumda toping.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/60 hover:border-rose-500/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-rose-500/20">
                <ShieldCheck size={26} />
              </div>
              <h3 className="text-xl font-bold mb-3">Haqiqiy Fikr va Rasmlar</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Foydalanuvchilarning real taassurotlari, haqiqiy taom rasmlari va foydali deb baholangan sharhlar.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/60 hover:border-amber-500/50 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-500/20">
                <Heart size={26} />
              </div>
              <h3 className="text-xl font-bold mb-3">Sevimlilar & Shaxsiy Ro&apos;yxat</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                O&apos;zingizga yoqqan maskonlarni bir tugma bilan saqlab qo&apos;ying va istalgan vaqtda qayta oching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 text-white p-10 md:p-16 text-center shadow-2xl">
          <div className="relative max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              O&apos;z Restoraningizni Qo&apos;shishga Tayyormisiz?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 font-medium">
              Minglab foydalanuvchilar har kuni yangi mazali joylarni kashf etmoqda. Siz ham qo&apos;shiling!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/restaurants/add`}
                className="px-8 py-4 bg-white text-slate-900 font-extrabold rounded-2xl shadow-xl hover:bg-slate-100 hover:scale-105 transition duration-300"
              >
                + Restoran Qo&apos;shish
              </Link>
              <Link
                href={`/${locale}/restaurants`}
                className="px-8 py-4 bg-black/30 border border-white/30 text-white font-extrabold rounded-2xl backdrop-blur-sm hover:bg-black/40 transition duration-300"
              >
                Restoranlarni Ko&apos;rish
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-12 text-slate-600 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center shadow-sm">
              <UtensilsCrossed className="text-white" size={18} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">CoWork Restaurant Guide</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-semibold text-slate-600">
            <Link href={`/${locale}`} className="hover:text-orange-600 transition">Bosh sahifa</Link>
            <Link href={`/${locale}/restaurants`} className="hover:text-orange-600 transition">Restoranlar</Link>
            <Link href={`/${locale}/nearby`} className="hover:text-orange-600 transition">Yaqin atrofdagilar</Link>
            <Link href={`/${locale}/favorites`} className="hover:text-orange-600 transition">Sevimlilar</Link>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} CoWork. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </footer>
    </div>
  );
}
