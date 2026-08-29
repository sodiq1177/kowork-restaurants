"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  restaurantId: string;
  locale: string;
}

export default function FavoriteButton({
  restaurantId,
  locale,
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    if (session?.user) {
      fetch(`/api/favorites?restaurantId=${restaurantId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!ignore && data?.favorites) {
            setIsFavorited(
              Array.isArray(data.favorites) &&
                data.favorites.some(
                  (f: { restaurantId: string }) => f.restaurantId === restaurantId
                )
            );
          }
        })
        .catch((error) => console.error("Check favorite error:", error));
    }
    return () => {
      ignore = true;
    };
  }, [session, restaurantId]);

  const toggleFavorite = async () => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        const res = await fetch(
          `/api/favorites?restaurantId=${restaurantId}`,
          {
            method: "DELETE",
          }
        );
        if (res.ok) {
          setIsFavorited(false);
        }
      } else {
        // Add to favorites
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ restaurantId }),
        });
        if (res.ok) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error("Toggle favorite error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        isFavorited
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-white text-gray-700 border border-gray-300 hover:border-red-500 hover:text-red-500"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isFavorited ? "❤️ Saved" : "🤍 Save"}
    </button>
  );
}
