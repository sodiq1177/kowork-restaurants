import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import {
  User,
  UtensilsCrossed,
  MessageSquare,
  Heart,
  Star,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { getRestaurantImageUrl } from "@/lib/restaurantImages";

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    restaurants: {
      include: {
        images: true;
        _count: { select: { reviews: true } };
      };
    };
    reviews: {
      include: {
        restaurant: { select: { name: true } };
      };
    };
    favorites: {
      include: {
        restaurant: {
          include: {
            images: true;
          };
        };
      };
    };
    _count: {
      select: {
        restaurants: true;
        reviews: true;
        favorites: true;
      };
    };
  };
}>;

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations("profile");

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  let userData: UserWithRelations | null = null;
  try {
    userData = await prisma.user.findUnique({
      where: { id: session.user.id! },
      include: {
        restaurants: {
          include: {
            images: { take: 1 },
            _count: { select: { reviews: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        reviews: {
          include: {
            restaurant: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        favorites: {
          include: {
            restaurant: {
              include: {
                images: { take: 1 },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            restaurants: true,
            reviews: true,
            favorites: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    userData = null;
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 text-white py-12 border-b border-orange-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl">
              {userData?.name?.[0]?.toUpperCase() || <User size={36} />}
            </div>
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1.5 border border-orange-500/30">
                <Sparkles size={12} />
                <span>CoWork Foydalanuvchisi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {userData?.name || session.user.name || "Foydalanuvchi"}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                {userData?.email || session.user.email}
              </p>
            </div>

            <div className="sm:ml-auto flex items-center gap-3">
              <Link
                href={`/${locale}/restaurants/add`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-xs rounded-xl shadow-md hover:from-orange-600 hover:to-rose-600 transition"
              >
                <PlusCircle size={15} />
                <span>Restoran qo&apos;shish</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-3 gap-4 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100 mb-8 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-orange-600">
              {userData?._count.restaurants || 0}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center justify-center gap-1">
              <UtensilsCrossed size={12} />
              <span>Mening Restoranlarim</span>
            </div>
          </div>
          <div className="border-x border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-amber-500">
              {userData?._count.reviews || 0}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center justify-center gap-1">
              <MessageSquare size={12} />
              <span>Qoldirilgan Sharhlar</span>
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-rose-500">
              {userData?._count.favorites || 0}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center justify-center gap-1">
              <Heart size={12} />
              <span>Sevimli Maskonlar</span>
            </div>
          </div>
        </div>

        {/* 3 Columns Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 1: My Restaurants */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <UtensilsCrossed size={18} className="text-orange-500" />
              <h2 className="text-lg font-black text-slate-900">
                {t("myRestaurants") || "Mening Restoranlarim"}
              </h2>
            </div>

            <div className="space-y-4">
              {userData?.restaurants.map((r) => {
                const imageUrl = getRestaurantImageUrl({
                  id: r.id,
                  name: r.name,
                  category: r.category,
                  images: r.images,
                });

                return (
                  <Link
                    key={r.id}
                    href={`/${locale}/restaurants/${r.id}`}
                    className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 hover:border-orange-500/50 hover:bg-orange-50/30 transition group"
                  >
                    <img
                      src={imageUrl}
                      alt={r.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition truncate">
                        {r.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{r.category}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        <Star className="text-amber-500 fill-amber-500" size={12} />
                        <span className="font-bold text-slate-800">{r.avgRating.toFixed(1)}</span>
                        <span className="text-slate-400">({r._count.reviews})</span>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {(!userData?.restaurants || userData.restaurants.length === 0) && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Siz hali restoran qo&apos;shmagansiz.
                </div>
              )}
            </div>
          </div>

          {/* 2: My Reviews */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={18} className="text-amber-500" />
              <h2 className="text-lg font-black text-slate-900">
                {t("myReviews") || "Mening Sharhlarim"}
              </h2>
            </div>

            <div className="space-y-4">
              {userData?.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 truncate">
                      {rev.restaurant.name}
                    </span>
                    <div className="flex text-amber-400 shrink-0">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={12} className="fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  {rev.comment && (
                    <p className="text-slate-600 line-clamp-2 leading-relaxed mb-2">
                      {rev.comment}
                    </p>
                  )}
                  <span className="text-[10px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}

              {(!userData?.reviews || userData.reviews.length === 0) && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Hozircha birorta ham sharh qoldirmagansiz.
                </div>
              )}
            </div>
          </div>

          {/* 3: My Favorites */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <Heart size={18} className="text-rose-500 fill-rose-500" />
              <h2 className="text-lg font-black text-slate-900">
                {t("myFavorites") || "Sevimli Maskonlarim"}
              </h2>
            </div>

            <div className="space-y-4">
              {userData?.favorites.map((fav) => {
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
                    className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 hover:border-rose-500/50 hover:bg-rose-50/30 transition group"
                  >
                    <img
                      src={imageUrl}
                      alt={fav.restaurant.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition truncate">
                        {fav.restaurant.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{fav.restaurant.category}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        <Star className="text-amber-500 fill-amber-500" size={12} />
                        <span className="font-bold text-slate-800">
                          {fav.restaurant.avgRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {(!userData?.favorites || userData.favorites.length === 0) && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Sevimli restoranlar hali tanlanmagan.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
