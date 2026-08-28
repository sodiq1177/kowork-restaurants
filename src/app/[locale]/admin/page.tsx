"use client";

import { useEffect, useState } from "react";
import { Users, UtensilsCrossed, Star, Trash2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { restaurants: number; reviews: number };
}

interface Restaurant {
  id: string;
  name: string;
  category: string;
  avgRating: number;
  reviewCount: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: { name: string };
  restaurant: { name: string };
  createdAt: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "restaurants" | "reviews">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === "users") {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } else if (activeTab === "restaurants") {
      const res = await fetch("/api/restaurants");
      const data = await res.json();
      setRestaurants(data.restaurants || []);
    } else {
      // Fetch all reviews - would need dedicated endpoint
      setReviews([]);
    }
    setLoading(false);
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE" });
    fetchData();
  };

  const deleteRestaurant = async (restaurantId: string) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return;

    await fetch(`/api/restaurants/${restaurantId}`, { method: "DELETE" });
    fetchData();
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold ${
            activeTab === "users"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Users size={20} />
          Users
        </button>
        <button
          onClick={() => setActiveTab("restaurants")}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold ${
            activeTab === "restaurants"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <UtensilsCrossed size={20} />
          Restaurants
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold ${
            activeTab === "reviews"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Star size={20} />
          Reviews
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {activeTab === "users" && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user._count.restaurants} restaurants, {user._count.reviews} reviews
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "restaurants" && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{restaurant.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        ⭐ {restaurant.avgRating.toFixed(1)} ({restaurant.reviewCount})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => deleteRestaurant(restaurant.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
