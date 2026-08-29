"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";

interface ReviewFormProps {
  restaurantId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ restaurantId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Iltimos, yulduzcha orqali baho bering (1-5)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Fikr qoldirishda xatolik yuz berdi");
        return;
      }

      setRating(0);
      setComment("");
      onSuccess();
    } catch {
      setError("Server bilan bog'lanishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <h3 className="text-lg font-black text-slate-900 mb-4">
        Restoranga baho va sharh qoldiring
      </h3>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Bahoyingiz *
        </label>
        <div className="flex gap-2 items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition hover:scale-110 cursor-pointer"
            >
              <Star
                size={30}
                className={
                  star <= (hoveredRating || rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-200 hover:text-amber-200"
                }
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-xs font-bold text-slate-700 ml-2">
              {rating === 5
                ? "A'lo darajada! 🌟"
                : rating === 4
                ? "Juda yaxshi 👍"
                : rating === 3
                ? "O'rtacha 🙂"
                : rating === 2
                ? "Qoniqarsiz 🙁"
                : "Yomon ❌"}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Fikr va taassurotlaringiz
        </label>
        <textarea
          id="comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-slate-50 text-slate-900 px-4 py-3 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition text-sm font-medium"
          placeholder="Taomlar sifati, xizmat ko'rsatish va muhit haqida yozing..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
      >
        <Send size={16} />
        <span>{loading ? "Yuborilmoqda..." : "Fikrni Yuborish"}</span>
      </button>
    </form>
  );
}
