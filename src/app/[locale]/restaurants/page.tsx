"use client";

import { useCallback, useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Star,
  MapPin,
  ExternalLink,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  UtensilsCrossed,
  ArrowUpDown,
} from "lucide-react";
import { getRestaurantImageUrl } from "@/lib/restaurantImages";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  url?: string;
  avgRating: number;
  reviewCount?: number;
  priceLevel: string;
  images: { url: string }[];
  _count?: { reviews: number };
  distance?: number;
  isLocal?: boolean;
}

const CATEGORIES = [
  "All",
  "Uzbek",
  "Italian",
  "Japanese",
  "Korean",
  "Chinese",
  "Fast Food",
  "Cafe",
  "Steakhouse",
];

function RestaurantsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialQuery);
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState(initialCategory === "All" ? "" : initialCategory);
  const [minRating, setMinRating] = useState(0);
  const [priceLevel, setPriceLevel] = useState("");
  const [radius, setRadius] = useState(10); // km
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "name">("rating");

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const qParams = new URLSearchParams();
      if (search) qParams.set("q", search);
      if (address) qParams.set("address", address);
      if (category && category !== "All") qParams.set("category", category);
      if (minRating > 0) qParams.set("minRating", minRating.toString());
      if (priceLevel) qParams.set("priceLevel", priceLevel);
      if (address) qParams.set("radius", radius.toString());

      const res = await fetch(`/api/search?${qParams.toString()}`);
      const data = await res.json().catch(() => null);

      if (res.ok && Array.isArray(data?.restaurants)) {
        setRestaurants(data.restaurants);
      } else {
        const fallbackRes = await fetch(
          `/api/restaurants?q=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`
        );
        const fallbackData = await fallbackRes.json().catch(() => null);
        setRestaurants(
          fallbackRes.ok && Array.isArray(fallbackData?.restaurants)
            ? fallbackData.restaurants
            : []
        );
      }
    } catch {
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [search, address, category, minRating, priceLevel, radius]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchRestaurants();
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, [fetchRestaurants]);

  const handleResetFilters = () => {
    setSearch("");
    setAddress("");
    setCategory("");
    setMinRating(0);
    setPriceLevel("");
    setRadius(10);
    setSortBy("rating");
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(address) ||
    Boolean(category) ||
    minRating > 0 ||
    Boolean(priceLevel);

  // Sorted list
  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (sortBy === "rating") {
      return (b.avgRating || 0) - (a.avgRating || 0);
    }
    if (sortBy === "reviews") {
      const rA = a._count?.reviews ?? a.reviewCount ?? 0;
      const rB = b._count?.reviews ?? b.reviewCount ?? 0;
      return rB - rA;
    }
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 text-white py-14 border-b border-orange-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4 border border-orange-500/30">
              <Sparkles size={14} />
              <span>Katalog va Qidiruv</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
              Restoranlar va Oshxonalar
            </h1>
            <p className="text-slate-300 text-base sm:text-lg">
              O&apos;zingizga ma&apos;qul oshxona va hududdagi eng zo&apos;r taom maskanlarini qidiring.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Main Filter & Search Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 mb-8 backdrop-blur-md">
          {/* Row 1: Search and Address Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="md:col-span-7">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
                <input
                  type="text"
                  placeholder="Restoran nomi, taom yoki kalit so'z..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition font-medium text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" size={20} />
                <input
                  type="text"
                  placeholder="Manzil yoki hudud (Toshkent, ko'cha...)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition font-medium text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = (!category && cat === "All") || category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat === "All" ? "" : cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat === "All" ? "Barcha Oshxonalar" : cat}
                </button>
              );
            })}
          </div>

          {/* Row 3: Advanced Controls (Rating, Price, Radius, Sort, Reset) */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Rating Filter */}
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
              >
                <option value={0}>Barcha reytinglar</option>
                <option value={4.5}>4.5+ ⭐ A&apos;lo</option>
                <option value={4.0}>4.0+ ⭐ Juda yaxshi</option>
                <option value={3.0}>3.0+ ⭐ Yaxshi</option>
              </select>

              {/* Price Filter */}
              <select
                value={priceLevel}
                onChange={(e) => setPriceLevel(e.target.value)}
                className="bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
              >
                <option value="">Barcha narxlar</option>
                <option value="BUDGET">$ Hamyonbop</option>
                <option value="MODERATE">$$ O&apos;rtacha</option>
                <option value="EXPENSIVE">$$$ Qimmat</option>
                <option value="LUXURY">$$$$ Lyuks</option>
              </select>

              {/* Radius if address is set */}
              {address && (
                <select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
                >
                  <option value={1}>Radius: 1 km</option>
                  <option value={3}>Radius: 3 km</option>
                  <option value={5}>Radius: 5 km</option>
                  <option value={10}>Radius: 10 km</option>
                  <option value={15}>Radius: 15 km</option>
                </select>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort selector */}
              <div className="flex items-center gap-1.5 text-slate-600 text-xs sm:text-sm font-medium">
                <ArrowUpDown size={15} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "rating" | "reviews" | "name")}
                  className="bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="rating">Eng yuqori reyting</option>
                  <option value="reviews">Eng ko&apos;p sharhlar</option>
                  <option value="name">Nomi bo&apos;yicha (A-Z)</option>
                </select>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Tozalash</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-slate-600 text-sm font-medium">
            Topildi: <span className="font-black text-slate-900 text-base">{sortedRestaurants.length}</span> ta restoran
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-white border border-slate-100 p-4 animate-pulse">
                <div className="h-52 bg-slate-200 rounded-2xl mb-4" />
                <div className="h-5 bg-slate-200 rounded-lg w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 rounded-lg w-1/2 mb-4" />
                <div className="h-4 bg-slate-200 rounded-lg w-full" />
              </div>
            ))}
          </div>
        ) : sortedRestaurants.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-16 text-center max-w-lg mx-auto my-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-orange-50 rounded-full flex items-center justify-center text-4xl">
              🍽️
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Restoran topilmadi</h3>
            <p className="text-slate-500 text-sm mb-6">
              Qidiruv so&apos;zini o&apos;zgartirib ko&apos;ring yoki filtrlarni tozalang.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedRestaurants.map((restaurant) => {
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

                    {/* Category & Badge */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold shadow-md">
                        {restaurant.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-xs font-extrabold shadow-md">
                        {restaurant.priceLevel}
                      </span>
                    </div>

                    {/* Distance Badge if OSM/nearby */}
                    {typeof restaurant.distance === "number" && (
                      <div className="absolute top-14 right-4 bg-orange-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-md">
                        {restaurant.distance} km
                      </div>
                    )}

                    {/* Rating on bottom left */}
                    <div className="absolute bottom-3.5 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg">
                      <Star className="text-amber-500 fill-amber-500" size={16} />
                      <span className="text-sm font-black text-slate-900">
                        {restaurant.avgRating > 0 ? restaurant.avgRating.toFixed(1) : "4.5"}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        ({restaurant._count?.reviews ?? restaurant.reviewCount ?? 0})
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition line-clamp-1">
                          {restaurant.name}
                        </h3>
                        {!isLocal && (
                          <span title="OpenStreetMap Manzili">
                            <ExternalLink size={16} className="text-slate-400 shrink-0 mt-1" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4">
                        <MapPin size={15} className="text-orange-500 shrink-0" />
                        <span className="line-clamp-1">{restaurant.address}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        {isLocal ? "Ko'rish uchun bosing" : "Tashqi xaritada ko'rish"}
                      </span>
                      <span className="text-xs font-bold text-orange-600 group-hover:translate-x-1 transition">
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
      </div>
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      }
    >
      <RestaurantsContent />
    </Suspense>
  );
}
