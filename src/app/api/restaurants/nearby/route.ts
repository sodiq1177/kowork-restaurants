import { NextRequest, NextResponse } from "next/server";
import { searchNearbyPlaces } from "@/lib/openStreetMap";
import { prisma } from "@/lib/prisma";
import { calculateDistance } from "@/lib/yandexMaps";
import { getRestaurantImageUrl } from "@/lib/restaurantImages";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");
  const radius = parseFloat(searchParams.get("radius") || "5"); // Default 5km

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Latitude and longitude required" },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch DB restaurants that have coordinates
    const dbRestaurants = await prisma.restaurant.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      include: {
        images: true,
        _count: { select: { reviews: true } },
      },
    });

    const nearbyLocal = dbRestaurants
      .map((r) => {
        const distance = Number(
          calculateDistance(lat, lng, r.latitude!, r.longitude!).toFixed(2)
        );
        const imageUrl = getRestaurantImageUrl({
          id: r.id,
          name: r.name,
          category: r.category,
          images: r.images,
        });

        return {
          id: r.id,
          name: r.name,
          category: r.category,
          address: r.address,
          avgRating: r.avgRating,
          reviewCount: r.reviewCount,
          priceLevel: r.priceLevel,
          distance,
          url: "",
          images: r.images && r.images.length > 0 ? r.images : [{ url: imageUrl }],
          _count: r._count,
          isLocal: true,
        };
      })
      .filter((r) => r.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    // 2. Fetch OpenStreetMap nearby places
    let osmPlaces: Array<{
      id: string;
      name: string;
      category: string;
      address: string;
      avgRating: number;
      reviewCount: number;
      priceLevel: string;
      distance: number;
      url: string;
      images: Array<{ url: string }>;
      _count: { reviews: number };
      isLocal: boolean;
    }> = [];

    try {
      const places = await searchNearbyPlaces(lat, lng, radius);
      osmPlaces = places.map((p) => {
        const fallbackImage = getRestaurantImageUrl({
          id: p.id,
          name: p.name,
          category: p.category,
        });

        return {
          id: p.id,
          name: p.name,
          category: p.category,
          address: p.address,
          avgRating: 0,
          reviewCount: 0,
          priceLevel: "MODERATE",
          distance: p.distance,
          url: p.url,
          images: [{ url: fallbackImage }],
          _count: { reviews: 0 },
          isLocal: false,
        };
      });
    } catch (osmError) {
      console.warn("OpenStreetMap nearby fetch failed, continuing with local only:", osmError);
    }

    const combined = [...nearbyLocal, ...osmPlaces].sort(
      (a, b) => a.distance - b.distance
    );

    return NextResponse.json({
      restaurants: combined,
      count: combined.length,
      userLocation: { lat, lng },
      radius,
    });
  } catch (error) {
    console.error("Nearby restaurants error:", error);
    return NextResponse.json(
      { error: "Failed to search nearby restaurants." },
      { status: 500 }
    );
  }
}
