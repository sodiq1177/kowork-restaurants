import { useTranslations } from "next-intl";
import Link from "next/link";
import { Search } from "lucide-react";

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("home");

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">{t("title")}</h1>
          <p className="text-xl mb-12 text-indigo-100">{t("subtitle")}</p>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full px-6 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700">
                <Search size={24} />
              </button>
            </div>
          </div>

          <Link
            href={`/${locale}/restaurants`}
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition"
          >
            {t("featuredTitle")} →
          </Link>
        </div>
      </div>

      <div className="bg-white text-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-gray-600">Find best restaurants near you</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Review</h3>
              <p className="text-gray-600">Share your dining experience</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold mb-2">Explore</h3>
              <p className="text-gray-600">View locations on map</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
