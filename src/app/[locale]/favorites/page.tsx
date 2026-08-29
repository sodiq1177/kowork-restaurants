import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { Star, MapPin, Heart, Sparkles, ArrowRight } from "lucide-react";
import { getRestaurantImageUrl } from "@/lib/restaurantImages";

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations("favorites");

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  type FavoriteWithRestaurant = Prisma.FavoriteGetPayload<{
    include: {
      restaurant: {
        include: {
          images: true;
          _count: { select: { reviews: true } };
        };
      };
    };
  }>;
  let favorites: FavoriteWithRestaurant[] = [];
  try {
    favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id! },
      include: {
        restaurant: {
          include: {
            images: { take: 2 },
            _count: { select: { reviews: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    favorites = [];
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white py-12 border-b border-rose-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3 border border-rose-500/30">
            <Heart size={14} className="fill-rose-400 text-rose-400" />
            <span>Sevimlilar To&apos;plami</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t("title") || "Sevimli Restoranlarim"} ({favorites.length})
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-1">
            Siz saqlab qo&apos;ygan va sevib tashrif buyuradigan taom maskonlari.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-14 text-center max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 text-3xl">
              ❤️
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Hozircha sevimlilar yo&apos;q</h3>
            <p className="text-slate-500 text-sm mb-6">
              O&apos;zingizga yoqqan restoranlarni yurakcha ❤️ tugmasini bosib saqlab qo&apos;yishingiz mumkin.
            </p>
            <Link
              href={`/${locale}/restaurants`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-sm rounded-xl shadow-md hover:from-orange-600 hover:to-rose-600 transition"
            >
              <span>Restoranlarni kashf qilish</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((fav) => {
              const imageUrl = getRestaurantImageUrl({
                id: fav.restaurant.id,
                name: fav.restaurant.name,
                category: fav.restaurant.category,
                images: fav.restaurant.images,
              });

              return (
                <Link
                  key={fav.id}
                  href={`/${locale}/restaurants/${fav.restaurant.id}`}
                  className="group rounded-3xl bg-white border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1.5 flex flex-col"
                >
                  {/* Photo Container */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                    <img
                      src={imageUrl}
                      alt={fav.restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                        {fav.restaurant.category}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                        <Heart size={16} className="fill-white" />
                      </span>
                    </div>

                    <div className="absolute bottom-3.5 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg">
                      <Star className="text-amber-500 fill-amber-500" size={16} />
                      <span className="text-sm font-black text-slate-900">
                        {fav.restaurant.avgRating.toFixed(1)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        ({fav.restaurant._count.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition line-clamp-1">
                          {fav.restaurant.name}
                        </h3>
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 shrink-0">
                          {fav.restaurant.priceLevel}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4">
                        <MapPin size={15} className="text-orange-500 shrink-0" />
                        <span className="line-clamp-1">{fav.restaurant.address}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600">
                      <span>Tafsilotlar</span>
                      <span className="group-hover:translate-x-1 transition">Batafsil →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
