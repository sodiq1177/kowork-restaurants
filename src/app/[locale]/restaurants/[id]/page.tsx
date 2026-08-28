"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Star, MapPin, Phone, Clock } from "lucide-react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

interface Restaurant {
  id: string;
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
    rating: number;
    comment: string;
    createdAt: string;
    user: { name: string };
  }>;
}

export default function RestaurantDetailPage() {
  const params = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurant();
  }, [params.id]);

  const fetchRestaurant = async () => {
    const res = await fetch(`/api/restaurants/${params.id}`);
    const data = await res.json();
    setRestaurant(data.restaurant);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return <div className="text-center py-12">Restaurant not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          {restaurant.images[0] ? (
            <img
              src={restaurant.images[0].url}
              alt={restaurant.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-6xl">🍽️</span>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
          <div className="flex items-center mb-4">
            <Star className="text-yellow-400 fill-yellow-400" size={24} />
            <span className="ml-2 text-2xl font-semibold">{restaurant.avgRating.toFixed(1)}</span>
            <span className="ml-2 text-gray-600">({restaurant.reviews.length} reviews)</span>
          </div>

          <p className="text-gray-700 mb-6">{restaurant.description}</p>

          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <MapPin className="mr-3" size={20} />
              <span>{restaurant.address}</span>
            </div>
            {restaurant.phone && (
              <div className="flex items-center text-gray-700">
                <Phone className="mr-3" size={20} />
                <span>{restaurant.phone}</span>
              </div>
            )}
            {restaurant.openingHours && (
              <div className="flex items-center text-gray-700">
                <Clock className="mr-3" size={20} />
                <span>{restaurant.openingHours}</span>
              </div>
            )}
            <div className="flex items-center text-gray-700">
              <span className="font-semibold mr-2">Category:</span>
              <span>{restaurant.category}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="font-semibold mr-2">Price:</span>
              <span>{restaurant.priceLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {restaurant.latitude && restaurant.longitude && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Location</h2>
          <MapComponent lat={restaurant.latitude} lng={restaurant.longitude} />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Reviews ({restaurant.reviews.length})</h2>
        <div className="space-y-4">
          {restaurant.reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="ml-3 font-semibold">{review.user.name}</span>
                <span className="ml-3 text-gray-500 text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
