"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, ExternalLink, Navigation, Sparkles } from "lucide-react";
import { getRestaurantImageUrl } from "@/lib/restaurantImages";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  avgRating?: number;
  reviewCount?: number;
  priceLevel: string;
  distance: number;
  url?: string;
  images?: { url: string }[];
  _count?: { reviews: number };
  isLocal?: boolean;
}

export default function NearbyPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [radius, setRadius] = useState(5);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setError("");
        },
        () => {
          setError("Joylashuvni aniqlash uchun ruxsat berilmadi. Iltimos, geolokatsiyani yoqing.");
          setLoading(false);
        }
      );
    } else {
      setError("Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (!location) return;

    let ignore = false;

    const load = async () => {
      try {
        const res = await fetch(
          `/api/restaurants/nearby?lat=${location.lat}&lng=${location.lng}&radius=${radius}`
        );
        const data = await res.json();
        if (ignore) return;
        if (Array.isArray(data?.restaurants)) {
          setRestaurants(data.restaurants);
          setError("");
        } else {
          setError(data?.error || "Yaqin-atrofdagi restoranlarni yuklashda xatolik yuz berdi.");
        }
      } catch (err) {
        if (!ignore) {
          setRestaurants([]);
          setError(
            err instanceof Error
              ? err.message
              : "Yaqin-atrofdagi restoranlarni yuklashda xatolik yuz berdi."
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    setLoading(true);
    void load();

    return () => {
      ignore = true;
    };
  }, [location, radius]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 text-white py-12 border-b border-orange-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3 border border-orange-500/30">
                <Navigation size={14} />
                <span>Geolokatsiya & Masofa</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Yaqin-Atrofdagi Restoranlar
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-1">
                Siz turgan joyga eng yaqin joylashgan eng sara maskonlar.
              </p>
            </div>

            {/* Radius Selector */}
            {location && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
                <span className="text-white/80 font-bold text-xs px-3">Radius:</span>
                {[1, 3, 5, 10, 15].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadius(r)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      radius === r
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {r}km
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 mb-8 text-center max-w-lg mx-auto shadow-sm">
            <p className="text-rose-700 mb-4 font-semibold text-sm">{error}</p>
            <button
              type="button"
              onClick={getLocation}
              className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-md cursor-pointer text-sm"
            >
              Qayta urinish
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-orange-500 border-t-transparent mx-auto"></div>
            <p className="text-slate-600 mt-4 font-semibold text-sm">
              Yaqin-atrofdagi restoranlar qidirilmoqda...
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="text-slate-600 text-sm font-medium">
                <span className="font-bold text-slate-900">{radius} km</span> radiusda{" "}
                <span className="font-black text-slate-900">{restaurants.length}</span> ta restoran topildi
              </div>
            </div>

            {restaurants.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-14 text-center max-w-md mx-auto">
                <div className="text-5xl mb-3">📍</div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Bu hududda restoran topilmadi</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Qidiruv radiusini kattalashtirib ko&apos;ring (masalan, 10km yoki 15km).
                </p>
                <button
                  type="button"
                  onClick={() => setRadius(15)}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition cursor-pointer text-sm"
                >
                  Radiusni 15 km ga kengaytirish
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {restaurants.map((restaurant) => {
                  const isLocal = !restaurant.id.startsWith("osm-");
                  const imageUrl = getRestaurantImageUrl({
                    id: restaurant.id,
                    name: restaurant.name,
                    category: restaurant.category,
                    images: restaurant.images,
                  });

                  const cardContent = (
                    <div className="group h-full flex flex-col bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1.5">
                      {/* Photo Container */}
                      <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                        <img
                          src={imageUrl}
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                            {restaurant.category}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-extrabold shadow-md flex items-center gap-1">
                            <Navigation size={12} />
                            <span>{restaurant.distance} km</span>
                          </span>
                        </div>

                        {/* Rating on bottom left */}
                        <div className="absolute bottom-3.5 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg">
                          <Star className="text-amber-500 fill-amber-500" size={16} />
                          <span className="text-sm font-black text-slate-900">
                            {restaurant.avgRating && restaurant.avgRating > 0
                              ? restaurant.avgRating.toFixed(1)
                              : "4.5"}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            ({restaurant._count?.reviews ?? restaurant.reviewCount ?? 0})
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition line-clamp-1">
                              {restaurant.name}
                            </h3>
                            {!isLocal && (
                              <ExternalLink size={16} className="text-slate-400 shrink-0 mt-1" />
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4">
                            <MapPin size={15} className="text-orange-500 shrink-0" />
                            <span className="line-clamp-1">{restaurant.address}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-500">
                            {isLocal ? "Ko'rish uchun bosing" : "Tashqi xaritada ko'rish"}
                          </span>
                          <span className="font-bold text-orange-600 group-hover:translate-x-1 transition">
                            Batafsil →
                          </span>
                        </div>
                      </div>
                    </div>
                  );

                  if (isLocal) {
                    return (
                      <Link
                        key={restaurant.id}
                        href={`/${locale}/restaurants/${restaurant.id}`}
                      >
                        {cardContent}
                      </Link>
                    );
                  }

                  return (
                    <a
                      key={restaurant.id}
                      href={
                        restaurant.url ||
                        `https://www.openstreetmap.org/search?query=${encodeURIComponent(restaurant.name)}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {cardContent}
                    </a>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
