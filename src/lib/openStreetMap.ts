import { calculateDistance } from "@/lib/yandexMaps";

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export interface NearbyPlace {
  id: string;
  name: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
  url: string;
  distance: number;
}

const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";
const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";
const TASHKENT = { lat: 41.3111, lng: 69.2797 };

export async function searchNearbyPlaces(
  lat: number,
  lng: number,
  radiusKm: number
): Promise<NearbyPlace[]> {
  const radiusMeters = Math.max(500, Math.min(radiusKm * 1000, 15000));
  const query = `[out:json][timeout:20];\n(
  nwr["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
  nwr["amenity"="fast_food"](around:${radiusMeters},${lat},${lng});
);\nout center tags;`;

  const response = await fetch(OVERPASS_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "CoWorkRestaurantReviews/1.0",
    },
    body: new URLSearchParams({ data: query }),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`OpenStreetMap search failed with status ${response.status}`);
  }

  const data = (await response.json()) as { elements?: OverpassElement[] };

  return (data.elements || [])
    .map((element) => {
      const elementLat = element.lat ?? element.center?.lat;
      const elementLng = element.lon ?? element.center?.lon;
      const tags = element.tags || {};

      if (elementLat === undefined || elementLng === undefined || !tags.name) {
        return null;
      }

      const address = [
        tags["addr:street"],
        tags["addr:housenumber"],
        tags["addr:city"],
      ]
        .filter(Boolean)
        .join(", ") || "Address unavailable";

      return {
        id: `osm-${element.type}-${element.id}`,
        name: tags.name,
        address,
        category: tags.amenity === "fast_food" ? "Fast Food" : "Restaurant",
        lat: elementLat,
        lng: elementLng,
        url: `https://www.openstreetmap.org/${element.type}/${element.id}`,
        distance: Number(calculateDistance(lat, lng, elementLat, elementLng).toFixed(2)),
      };
    })
    .filter((place): place is NearbyPlace => place !== null)
    .sort((first, second) => first.distance - second.distance);
}

export async function searchRestaurants(
  query: string,
  address: string,
  radiusKm: number,
  category: string,
  limit: number
): Promise<NearbyPlace[]> {
  let center = TASHKENT;

  if (address) {
    const response = await fetch(
      `${NOMINATIM_ENDPOINT}?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "CoWorkRestaurantReviews/1.0",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`OpenStreetMap geocoding failed with status ${response.status}`);
    }

    const locations = (await response.json()) as Array<{
      lat?: string;
      lon?: string;
    }>;
    const location = locations[0];

    if (!location?.lat || !location.lon) {
      return [];
    }

    center = { lat: Number(location.lat), lng: Number(location.lon) };
  }

  const places = await searchNearbyPlaces(center.lat, center.lng, radiusKm);
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedCategory = category.trim().toLowerCase();

  return places
    .filter((place) => {
      const matchesQuery = normalizedQuery
        ? `${place.name} ${place.address} ${place.category}`
            .toLowerCase()
            .includes(normalizedQuery)
        : true;
      const matchesCategory = normalizedCategory
        ? place.category.toLowerCase() === normalizedCategory
        : true;
      return matchesQuery && matchesCategory;
    })
    .slice(0, limit);
}
