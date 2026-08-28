"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, Filter, Star } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  avgRating: number;
  priceLevel: string;
  images: { url: string }[];
  _count: { reviews: number };
}

export default function RestaurantsPage() {
  const t = useTranslations("restaurants");
  const params = useParams();
  const locale = params.locale as string;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    fetchRestaurants();
  }, [search, category, minRating]);

  const fetchRestaurants = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category) params.set("category", category);
    if (minRating > 0) params.set("minRating", minRating.toString());

    const res = await fetch(`/api/restaurants?${params.toString()}`);
    const data = await res.json();
    setRestaurants(data.restaurants || []);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

      <div className="mb-8 grid md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">{t("category")}</option>
          <option value="Uzbek">Uzbek</option>
          <option value="Italian">Italian</option>
          <option value="Japanese">Japanese</option>
          <option value="Korean">Korean</option>
          <option value="Fast Food">Fast Food</option>
        </select>

        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
        >
          <option value={0}>{t("minRating")}</option>
          <option value={4}>4+ ⭐</option>
          <option value={3}>3+ ⭐</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t("noResults")}</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/${locale}/restaurants/${restaurant.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="h-48 bg-gray-200 relative">
                {restaurant.images[0] && (
                  <img
                    src={restaurant.images[0].url}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{restaurant.category}</p>
                <p className="text-gray-500 text-sm mb-3">{restaurant.address}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-yellow-400" size={16} />
                    <span className="ml-1 font-semibold">{restaurant.avgRating.toFixed(1)}</span>
                    <span className="ml-1 text-gray-500 text-sm">
                      ({restaurant._count.reviews})
                    </span>
                  </div>
                  <span className="text-gray-600">{restaurant.priceLevel}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
