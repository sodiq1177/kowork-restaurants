"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface RestaurantFormState {
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  openingHours: string;
  priceLevel: "BUDGET" | "MODERATE" | "EXPENSIVE" | "LUXURY";
  latitude: number;
  longitude: number;
  imageUrl: string;
}

export default function EditRestaurantPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const locale = resolvedParams.locale || "en";
  const restaurantId = resolvedParams.id;

  const [formData, setFormData] = useState<RestaurantFormState>({
    name: "",
    description: "",
    category: "",
    address: "",
    phone: "",
    openingHours: "",
    priceLevel: "MODERATE",
    latitude: 0,
    longitude: 0,
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login?callbackUrl=/${locale}/restaurants/${restaurantId}/edit`);
      return;
    }

    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`/api/restaurants/${restaurantId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || "Restoran topilmadi");
          setLoading(false);
          return;
        }

        const restaurant = data.restaurant;

        const isAllowed =
          session?.user?.id === restaurant.createdById || session?.user?.role === "ADMIN";

        if (session?.user?.id && !isAllowed) {
          router.push(`/${locale}/restaurants/${restaurantId}`);
          return;
        }

        setFormData({
          name: restaurant.name || "",
          description: restaurant.description || "",
          category: restaurant.category || "Uzbek",
          address: restaurant.address || "",
          phone: restaurant.phone || "",
          openingHours: restaurant.openingHours || "",
          priceLevel: restaurant.priceLevel || "MODERATE",
          latitude: restaurant.latitude ?? 0,
          longitude: restaurant.longitude ?? 0,
          imageUrl: restaurant.images?.[0]?.url || "",
        });
      } catch {
        setError("Restoran ma'lumotlarini yuklashda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      void fetchRestaurant();
    }
  }, [status, session, locale, restaurantId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "latitude" || name === "longitude"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/restaurants/${restaurantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Restoran ma'lumotlarini yangilab bo'lmadi.");
        setSaving(false);
        return;
      }

      router.push(`/${locale}/restaurants/${restaurantId}`);
    } catch {
      setError("Restoran ma'lumotlarini saqlashda xatolik yuz berdi.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/${locale}/restaurants/${restaurantId}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition mb-3"
          >
            <ArrowLeft size={14} />
            <span>Restoranga qaytish</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Restoranni Tahrirlash
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Ma&apos;lumotlar va rasm havolasini yangilang.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3.5 rounded-2xl text-sm font-semibold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          <div>
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Restoran Nomi *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-50 text-slate-900 px-4 py-3 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:outline-none transition text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Oshxona Turi *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-900 px-4 py-3 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:outline-none transition text-sm font-semibold"
              >
                <option value="Uzbek">Uzbek</option>
                <option value="Italian">Italian</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Chinese">Chinese</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Cafe">Cafe</option>
                <option value="Steakhouse">Steakhouse</option>
              </select>
            </div>

            <div>
              <label htmlFor="priceLevel" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Narx Darajasi
              </label>
              <select
                id="priceLevel"
                name="priceLevel"
                value={formData.priceLevel}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-900 px-4 py-3 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:outline-none transition text-sm font-semibold"
              >
                <option value="BUDGET">$ Hamyonbop (Budget)</option>
                <option value="MODERATE">$$ O&apos;rtacha (Moderate)</option>
                <option value="EXPENSIVE">$$$ Qimmat (Expensive)</option>
                <option value="LUXURY">$$$$ Lyuks (Luxury)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Aniq Manzil *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-slate-50 text-slate-900 px-4 py-3 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:outline-none transition text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Telefon Raqami
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-900 px-4 py-3 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:outline-none transition text-sm font-medium"
              />
            </div>

            <div>
              <label htmlFor="openingHours" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Ish Vaqti
              </label>
              <input
                type="text"
                id="openingHours"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-900 px-4 py-3 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:outline-none transition text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Rasm Havolasi (Image URL)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full bg-slate-50 text-slate-900 px-4 py-3 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:outline-none transition text-sm font-medium"
            />
            {formData.imageUrl && (
              <div className="mt-3 h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                <img
                  src={formData.imageUrl}
                  alt="Rasm ko'rinishi"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Tavsif (Description)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-50 text-slate-900 p-4 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:outline-none transition text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition cursor-pointer text-base disabled:opacity-50"
          >
            {saving ? "Saqlanmoqda..." : "O'zgarishlarni Saqlash"}
          </button>
        </form>
      </div>
    </div>
  );
}
