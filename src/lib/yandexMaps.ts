import axios from "axios";

// Yandex Maps geocoding and search utility
// Requires: NEXT_PUBLIC_YANDEX_MAPS_API_KEY in .env

const YANDEX_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || "";

export function isYandexConfigured(): boolean {
  return Boolean(YANDEX_API_KEY && YANDEX_API_KEY !== "free-yandex-maps-key");
}

/**
 * Geocode an address using Yandex Maps API
 * Returns coordinates (lat, lng)
 */
export async function geocodeAddress(address: string): Promise<{
  lat: number;
  lng: number;
} | null> {
  if (!YANDEX_API_KEY) {
    console.warn("Yandex Maps API key not configured");
    return null;
  }

  try {
    const response = await axios.get(
      "https://geocode-maps.yandex.ru/1.x/",
      {
        params: {
          apikey: YANDEX_API_KEY,
          geocode: address,
          format: "json",
          lang: "en_US",
        },
      }
    );

    const features =
      response.data?.response?.GeoObjectCollection?.featureMember;
    if (!features || features.length === 0) {
      return null;
    }

    const coords =
      features[0].GeoObject.Point.pos.split(" ").map(Number);
    return {
      lng: coords[0],
      lat: coords[1],
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Search for places using Yandex Maps Search API
 */
export async function searchPlaces(
  query: string,
  lat?: number,
  lng?: number
): Promise<
  Array<{
    id: string;
    name: string;
    address: string;
    category: string;
    lat: number;
    lng: number;
  }>
> {
  if (!YANDEX_API_KEY) {
    console.warn("Yandex Maps API key not configured");
    return [];
  }

  try {
    const bbox =
      lat && lng
        ? `${lng - 0.5},${lat - 0.5}~${lng + 0.5},${lat + 0.5}`
        : undefined;

    const response = await axios.get("https://search-maps.yandex.ru/v1/", {
      params: {
        apikey: YANDEX_API_KEY,
        text: query,
        bbox,
        lang: "en_US",
        type: "biz",
        results: 20,
      },
    });

    interface YandexFeature {
      id: string;
      properties?: {
        name?: string;
        description?: string;
        CompanyMetaData?: {
          address?: string;
          Categories?: Array<{ name?: string }>;
        };
      };
      geometry?: {
        coordinates?: [number, number];
      };
    }

    return (
      (response.data?.features as YandexFeature[] | undefined)?.map((feature) => ({
        id: feature.id,
        name: feature.properties?.name || "",
        address:
          feature.properties?.description ||
          feature.properties?.CompanyMetaData?.address ||
          "",
        category:
          feature.properties?.CompanyMetaData?.Categories?.[0]?.name ||
          "Restaurant",
        lat: feature.geometry?.coordinates?.[1] || 0,
        lng: feature.geometry?.coordinates?.[0] || 0,
      })) || []
    );
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}

/**
 * Calculate distance between two points (Haversine formula - fallback)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
