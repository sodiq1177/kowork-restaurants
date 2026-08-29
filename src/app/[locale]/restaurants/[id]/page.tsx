"use client";

import { useEffect, useState, use } from "react";
import {
  Star,
  MapPin,
  Phone,
  Clock,
  Pencil,
  Trash2,
  Share2,
  UtensilsCrossed,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import HelpfulButton from "@/components/HelpfulButton";
import ReviewForm from "@/components/ReviewForm";
import { getRestaurantImageUrl, getCategoryImages } from "@/lib/restaurantImages";
import { getOpenStatus } from "@/lib/openNow";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

interface Restaurant {
  id: string;
  createdById: string;
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  openingHours: string;
  avgRating: number;
  priceLevel: string;
  latitude: number;
  longitude: number;
  images: { url: string }[];
  reviews: Array<{
    id: string;
    userId: string;
    rating: number;
    comment: string;
    helpfulCount: number;
    createdAt: string;
    user: { id: string; name: string };
  }>;
}

export default function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale || "en";
  const restaurantId = resolvedParams.id;

  const { data: session } = useSession();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [submittingReviewEdit, setSubmittingReviewEdit] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchRestaurant = async () => {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}`);
      if (res.ok) {
        const data = await res.json();
        setRestaurant(data.restaurant);
      }
    } catch (error) {
      console.error("Fetch restaurant error:", error);
    }
  };

  useEffect(() => {
    let ignore = false;

    fetch(`/api/restaurants/${restaurantId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore) {
          if (data?.restaurant) {
            setRestaurant(data.restaurant);
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Fetch restaurant error:", error);
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [restaurantId]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Ushbu fikrni o'chirmoqchimisiz?")) return;

    const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
    if (res.ok) {
      await fetchRestaurant();
    }
  };

  const startEditingReview = (review: Restaurant["reviews"][number]) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };

  const saveReviewEdit = async () => {
    if (!editingReviewId) return;
    setSubmittingReviewEdit(true);

    const res = await fetch(`/api/reviews/${editingReviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: editRating, comment: editComment }),
    });

    if (res.ok) {
      setEditingReviewId(null);
      setEditComment("");
      await fetchRestaurant();
    }

    setSubmittingReviewEdit(false);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="text-6xl mb-4">🍽️</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Restoran topilmadi</h2>
        <p className="text-slate-500 mb-6">Ushbu manzil bo&apos;yicha restoran mavjud emas yoki o&apos;chirilgan.</p>
        <Link
          href={`/${locale}/restaurants`}
          className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl"
        >
          Katalogga qaytish
        </Link>
      </div>
    );
  }

  const isOwnerOrAdmin =
    session?.user?.id === restaurant.createdById || session?.user?.role === "ADMIN";

  // Prepare images list
  const categoryImages = getCategoryImages(restaurant.category);
  const imagesList =
    restaurant.images && restaurant.images.length > 0
      ? restaurant.images.map((img) => img.url)
      : [getRestaurantImageUrl(restaurant), ...categoryImages.slice(1)];

  const activeImage = imagesList[activeImageIndex] || imagesList[0];
  const openStatus = getOpenStatus(restaurant.openingHours);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href={`/${locale}/restaurants`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-orange-600 transition"
          >
            <ChevronLeft size={16} />
            <span>Restoranlar ro&apos;yxatiga qaytish</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <Share2 size={14} />
              <span>{copied ? "Havola nusxalandi! ✓" : "Ulashish"}</span>
            </button>
            <FavoriteButton restaurantId={restaurant.id} locale={locale} />
            {isOwnerOrAdmin && (
              <Link
                href={`/${locale}/restaurants/${restaurant.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 shadow-xs transition"
              >
                <Pencil size={14} />
                <span>Tahrirlash</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Main Details & Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Gallery - 7 cols */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl overflow-hidden shadow-xl bg-slate-950 relative h-80 sm:h-[450px]">
              <img
                src={activeImage}
                alt={restaurant.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

              {/* Floating badges on top of photo */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold tracking-wide">
                  {restaurant.category}
                </span>
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black shadow-md ${
                    openStatus.isOpen ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                  }`}
                >
                  {openStatus.isOpen ? "Hozir ochiq • Open" : "Yopiq • Closed"}
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {imagesList.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {imagesList.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-2xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-orange-500 ring-2 ring-orange-500/30 scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info & Actions - 5 cols */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-xl text-amber-700 font-bold text-sm">
                    <Star className="text-amber-500 fill-amber-500" size={16} />
                    <span>{restaurant.avgRating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    ({restaurant.reviews.length} ta sharh)
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 ml-auto">
                    {restaurant.priceLevel}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
                  {restaurant.name}
                </h1>

                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                  {restaurant.description ||
                    "Mazali taomlar, yoqimli muhit va a'lo darajadagi xizmat ko'rsatish maskani."}
                </p>

                {/* Details List */}
                <div className="space-y-4 pt-4 border-t border-slate-100 text-sm">
                  <div className="flex items-start gap-3 text-slate-700">
                    <MapPin className="text-orange-500 shrink-0 mt-0.5" size={18} />
                    <div>
                      <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                        Manzil
                      </div>
                      <div>{restaurant.address}</div>
                    </div>
                  </div>

                  {restaurant.phone && (
                    <div className="flex items-start gap-3 text-slate-700">
                      <Phone className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                      <div>
                        <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                          Telefon
                        </div>
                        <a
                          href={`tel:${restaurant.phone}`}
                          className="font-semibold text-orange-600 hover:underline"
                        >
                          {restaurant.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {restaurant.openingHours && (
                    <div className="flex items-start gap-3 text-slate-700">
                      <Clock className="text-indigo-500 shrink-0 mt-0.5" size={18} />
                      <div>
                        <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                          Ish vaqti
                        </div>
                        <div>{restaurant.openingHours}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 text-slate-700">
                    <UtensilsCrossed className="text-rose-500 shrink-0 mt-0.5" size={18} />
                    <div>
                      <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                        Oshxona turi
                      </div>
                      <div className="font-semibold text-slate-800">{restaurant.category}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Location Section */}
        {restaurant.latitude && restaurant.longitude && (
          <div className="mb-14 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="text-orange-500" size={22} />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Xaritadagi Joylashuv</h2>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <MapComponent
                lat={restaurant.latitude}
                lng={restaurant.longitude}
                title={restaurant.name}
              />
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles size={14} />
                <span>Mehmonlar fikrlari</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Sharhlar va Taqrizlar ({restaurant.reviews.length})
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-slate-900">
                {restaurant.avgRating.toFixed(1)}
              </div>
              <div>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={
                        s <= Math.round(restaurant.avgRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>
                <div className="text-xs font-semibold text-slate-400">Umumiy reyting</div>
              </div>
            </div>
          </div>

          {/* Add Review Form */}
          <div className="mb-10">
            {session ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  O&apos;z taassurotingiz bilan bo&apos;lishing
                </h3>
                <ReviewForm
                  restaurantId={restaurant.id}
                  onSuccess={async () => {
                    await fetchRestaurant();
                  }}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 text-center text-sm text-amber-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✍️</span>
                  <span className="font-semibold text-left">
                    Fikr va baho qoldirish uchun hisobingizga kiring.
                  </span>
                </div>
                <Link
                  href={`/${locale}/login`}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
                >
                  Kirish / Ro&apos;yxatdan o&apos;tish
                </Link>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {restaurant.reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-2">💬</div>
                <p className="font-medium text-sm">Hozircha sharhlar yo&apos;q. Birinchi bo&apos;lib fikr bildiring!</p>
              </div>
            ) : (
              restaurant.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {review.user.name ? review.user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{review.user.name}</div>
                        <div className="text-xs text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={15}
                            className={
                              s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                            }
                          />
                        ))}
                      </div>

                      {session?.user?.id === review.userId && (
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            type="button"
                            onClick={() => startEditingReview(review)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {editingReviewId === review.id ? (
                    <div className="mt-4 space-y-3 p-4 rounded-xl bg-white border border-slate-200">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            className="cursor-pointer"
                          >
                            <Star
                              size={20}
                              className={
                                star <= editRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:border-orange-500"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={saveReviewEdit}
                          disabled={submittingReviewEdit}
                          className="px-4 py-1.5 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50"
                        >
                          {submittingReviewEdit ? "Saqlanmoqda..." : "Saqlash"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingReviewId(null)}
                          className="px-4 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
                        >
                          Bekor qilish
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-700 text-sm leading-relaxed mb-4">
                        {review.comment || "Fikr matni kiritilmagan."}
                      </p>
                      <HelpfulButton
                        reviewId={review.id}
                        initialCount={review.helpfulCount}
                        locale={locale}
                      />
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
