"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../../contexts/CartContext";
import ModelViewer from "@/components/ModelViewer";

export default function FoodOverview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [foodId, setFoodId] = useState(null); // Initialize as null
  const { addToCart } = useCart();
  const [activeModel, setActiveModel] = useState(null);
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modelViewerRef = useRef();

  // Base URL for the backend
  const BASE_URL = "https://smartmenu-backend.up.railway.app";

  // Extract foodId after component mounts
  useEffect(() => {
    const foodIdParam = searchParams.get("foodId");
    setFoodId(foodIdParam);
  }, [searchParams]);

  // Fetch food once foodId is available
  useEffect(() => {
    const fetchFood = async () => {
      if (!foodId) {
        setLoading(false);
        setError("No food ID provided!");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/foods/${foodId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch food: ${response.statusText}`);
        }

        const foodData = await response.json();
        console.log("Fetched food:", foodData); // Debug log

        setFood(foodData);
        setActiveModel(foodData.model3DUrl || null);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (foodId !== null) { // Wait until foodId is set
      fetchFood();
    }
  }, [foodId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="w-16 h-16 animate-spin rounded-full border-4 border-t-orange-500 border-gray-200"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Error</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Not Found</h3>
          <p className="text-gray-400">Food not found!</p>
        </div>
      </div>
    );
  }

  const AddToCart = () => {
    addToCart({
      id: food._id,
      name: food.name,
      price: food.price,
      image: food.imageUrl || "",
      description: food.description,
    });
  };

  // Format dietary, ingredients, and tags
  const dietary = food.dietary || "N/A";
  const ingredients = Array.isArray(food.ingredients)
    ? food.ingredients.join(", ")
    : "N/A";
  const tags = Array.isArray(food.tags) ? food.tags.join(", ") : "N/A";

  // Convert availability boolean to string
  const availability = food.availability ? "In Stock" : "Out of Stock";

  // Convert preparationTime to string with minutes
  const preparationTime = food.preparationTime
    ? `${food.preparationTime} mins`
    : "N/A";

  // Convert spiceLevel to a descriptive string
  const spiceLevel = food.spiceLevel
    ? {
        0: "None",
        1: "Mild",
        2: "Medium",
        3: "Hot",
        4: "Very Hot",
        5: "Extreme",
      }[food.spiceLevel] || "N/A"
    : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6 pt-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Food Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full h-96 rounded-2xl overflow-hidden">
              {activeModel ? (
                <ModelViewer src={activeModel} />
              ) : (
                <img
                  src={food.imageUrl || "/placeholder.png"}
                  alt={food.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              )}
            </div>
          </div>

          {/* Food Details */}
          <div className="w-full md:w-1/2">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{food.name}</h1>
              <div className="flex items-center bg-orange-500 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">{food.rating || "N/A"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            <p className="mt-1">
              {food.origin || "Unknown Origin"} • {preparationTime}
            </p>

            <p className="mt-4">{food.description || "No description available"}</p>

            <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-semibold text-orange-400">
                  ${food.price ? food.price.toFixed(2) : "0.00"}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    availability === "In Stock"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {availability}
                </span>
              </div>
              <p className="text-sm text-gray-300">{food.servingSize || "N/A"}</p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-600 border-opacity-50 my-6"></div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={AddToCart}
                className="flex-1 bg-orange-500 py-3 px-6 rounded-lg flex items-center border justify-center gap-2 shadow-md text-white hover:bg-orange-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Add to Cart
              </button>
            </div>

            {/* Detailed Information Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nutrition Information */}
              <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-100">
                  Nutrition Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Calories</span>
                    <span className="font-medium">
                      {food.calories ? `${food.calories} kcal` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Protein</span>
                    <span className="font-medium">
                      {food.protein ? `${food.protein}g` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Carbs</span>
                    <span className="font-medium">
                      {food.carbs ? `${food.carbs}g` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fats</span>
                    <span className="font-medium">
                      {food.fats ? `${food.fats}g` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Food Characteristics */}
              <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-100">
                  Characteristics
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Flavor</span>
                    <span className="font-medium capitalize">
                      {food.flavor?.toLowerCase() || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Spice Level</span>
                    <span className="font-medium capitalize">{spiceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dietary</span>
                    <span className="font-medium capitalize">{dietary}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mt-6 bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-gray-100">
                Ingredients
              </h3>
              <p className="text-gray-400">{ingredients}</p>
            </div>

            {/* Tags */}
            {tags && tags !== "N/A" && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-100">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 bg-opacity-70 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}