"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface HelpfulButtonProps {
  reviewId: string;
  initialCount: number;
  locale: string;
}

export default function HelpfulButton({
  reviewId,
  initialCount,
  locale,
}: HelpfulButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user voted
  useEffect(() => {
    let ignore = false;
    if (session?.user) {
      fetch(`/api/reviews/${reviewId}/helpful`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!ignore && data) {
            setIsHelpful(Boolean(data.voted));
          }
        })
        .catch((error) => console.error("Check vote error:", error));
    }
    return () => {
      ignore = true;
    };
  }, [session, reviewId]);

  const toggleHelpful = async () => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setIsHelpful(data.voted);
        setHelpfulCount((prev) => (data.voted ? prev + 1 : prev - 1));
      }
    } catch (error) {
      console.error("Toggle helpful error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleHelpful}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition ${
        isHelpful
          ? "bg-orange-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span>{isHelpful ? "👍" : "👍🏻"}</span>
      <span>{helpfulCount > 0 ? `Helpful (${helpfulCount})` : "Helpful"}</span>
    </button>
  );
}
