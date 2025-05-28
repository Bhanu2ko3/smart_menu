"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const FoodsByCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL for the backend
  const BASE_URL = "https://smartmenu-backend.up.railway.app";

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/foods`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch foods: ${response.statusText}`);
        }
        const foodsData = await response.json();
        console.log("Fetched foods:", foodsData); // Debug log
        console.log("Category from query:", category); // Debug log

        // Normalize category and food.category for case-insensitive matching
        const decodedCategory = decodeURIComponent(category).toLowerCase().trim();
        const filteredFoods = foodsData.filter((food) =>
          food.category?.toLowerCase().trim() === decodedCategory
        );
        console.log("Filtered foods:", filteredFoods); // Debug log

        setFoods(filteredFoods);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (category) {
      fetchFoods();
    } else {
      setError("No category selected");
      setLoading(false);
    }
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 animate-spin rounded-full border-4 border-t-orange-500 border-gray-200"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Error</h3>
          <p className="text-gray-400">{error || "No category selected!"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">{decodeURIComponent(category)}</h1>
        {foods.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              No foods found
            </h3>
            <p className="text-gray-400">
              No foods are available in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div
                key={food._id}
                className="bg-gray-800 rounded-xl shadow-md hover:shadow-lg border border-gray-700 p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                onClick={() => router.push(`/food?foodId=${food._id}`)}
              >
                <img
                  src={food.imageUrl || "/placeholder.png"}
                  alt={food.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-semibold">{food.name}</h3>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {food.description || "No description available"}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-orange-400 font-medium">
                    ${food.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400">
                    {food.rating} ⭐
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodsByCategory;