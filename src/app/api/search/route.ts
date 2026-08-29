import { NextRequest, NextResponse } from "next/server";
import { searchRestaurants } from "@/lib/openStreetMap";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getRestaurantImageUrl } from "@/lib/restaurantImages";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("q") || "";
  const address = searchParams.get("address") || "";
  const category = searchParams.get("category") || "";
  const minRating = parseFloat(searchParams.get("minRating") || "0");
  const priceLevel = searchParams.get("priceLevel") || "";
  const radius = parseFloat(searchParams.get("radius") || "10");
  const limit = parseInt(searchParams.get("limit") || "24");

  try {
    const where: Prisma.RestaurantWhereInput = {};

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
        { address: { contains: query } },
      ];
    }
    if (category) {
      where.category = { equals: category };
    }
    if (minRating > 0) {
      where.avgRating = { gte: minRating };
    }
    if (priceLevel) {
      where.priceLevel = { equals: priceLevel };
    }

    const dbRestaurants = await prisma.restaurant.findMany({
      where,
      include: {
        images: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { avgRating: "desc" },
      take: limit,
    });

    const localFormatted = dbRestaurants.map((r) => {
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
        images: r.images && r.images.length > 0 ? r.images : [{ url: imageUrl }],
        _count: r._count,
        url: "",
        isLocal: true,
      };
    });

    let osmResults: Array<{
      id: string;
      name: string;
      category: string;
      address: string;
      avgRating: number;
      reviewCount: number;
      priceLevel: string;
      images: Array<{ url: string }>;
      _count: { reviews: number };
      url: string;
      distance?: number;
      isLocal: boolean;
    }> = [];

    // If address filter is provided or local results are few, supplement with OpenStreetMap
    if ((address || localFormatted.length < limit) && minRating === 0) {
      try {
        const osmPlaces = await searchRestaurants(
          query,
          address,
          radius,
          category,
          Math.max(0, limit - localFormatted.length)
        );

        osmResults = osmPlaces.map((p) => {
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
            priceLevel: priceLevel || "MODERATE",
            images: [{ url: fallbackImage }],
            _count: { reviews: 0 },
            url: p.url,
            distance: p.distance,
            isLocal: false,
          };
        });
      } catch (osmError) {
        console.warn("OSM search fallback:", osmError);
      }
    }

    const combined = [...localFormatted, ...osmResults].slice(0, limit);

    return NextResponse.json({
      restaurants: combined,
      total: combined.length,
      userLocation: address ? "geocoded" : null,
      radius: address ? radius : null,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
