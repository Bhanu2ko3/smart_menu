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

    if (foodId !== null) {
      // Wait until foodId is set
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
          <h3 className="text-xl font-semibold text-gray-100 mb-2">
            Not Found
          </h3>
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
      <div className="max-w-7xl mx-auto p-6 pt-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Food Image & Model Viewer */}
          <div className="w-full lg:w-1/2">
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-gray-700/50">
              {activeModel ? (
                <ModelViewer
                  src={activeModel}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={food.imageUrl || "/placeholder-food.jpg"}
                  alt={food.name}
                  className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
                  onError={(e) => {
                    e.target.src = "/placeholder-food.jpg";
                  }}
                />
              )}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <button
                  onClick={() => setActiveModel(null)}
                  className={`p-2 rounded-full backdrop-blur-sm ${
                    !activeModel
                      ? "bg-orange-500/90 text-white"
                      : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80"
                  }`}
                  aria-label="Show image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                {food.model3DUrl && (
                  <button
                    onClick={() => setActiveModel(food.model3DUrl)}
                    className={`p-2 rounded-full backdrop-blur-sm ${
                      activeModel
                        ? "bg-orange-500/90 text-white"
                        : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80"
                    }`}
                    aria-label="Show 3D model"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Food Details */}
          <div className="w-full lg:w-1/2 space-y-6">
            {/* Header Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {food.name}
                </h1>
                <div className="flex items-center bg-orange-500/90 px-3 py-1 rounded-full shadow-md">
                  <span className="text-sm font-medium">
                    {food.rating || "N/A"}
                  </span>
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

              <div className="flex items-center gap-3 text-gray-300">
                {food.origin && (
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {food.origin}
                  </span>
                )}
                {food.preparationTime && (
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {preparationTime}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed">
              {food.description ||
                "No description available for this delicious dish."}
            </p>

            {/* Price & Availability */}
            <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-3xl font-bold text-orange-400">
                  ${food.price ? food.price.toFixed(2) : "0.00"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    availability === "In Stock"
                      ? "bg-green-900/30 text-green-400 border border-green-400/30"
                      : "bg-red-900/30 text-red-400 border border-red-400/30"
                  }`}
                >
                  {availability}
                </span>
              </div>
              {food.servingSize && (
                <p className="text-sm text-gray-400">
                  Serving size: {food.servingSize}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={AddToCart}
                className="flex-1 bg-orange-500 hover:bg-orange-600 py-3 px-6 rounded-xl flex items-center justify-center gap-3 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-orange-500/20"
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
              <button className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 px-6 rounded-xl flex items-center justify-center gap-3 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-gray-500/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Favorite
              </button>
            </div>

            {/* Detailed Information Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
              {/* Nutrition Information */}
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                <h3 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-orange-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Nutrition
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Calories", value: food.calories, unit: "kcal" },
                    { label: "Protein", value: food.protein, unit: "g" },
                    { label: "Carbs", value: food.carbs, unit: "g" },
                    { label: "Fats", value: food.fats, unit: "g" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-400">{item.label}</span>
                      <span className="font-medium">
                        {item.value ? `${item.value}${item.unit}` : "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Food Characteristics */}
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                <h3 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-orange-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Characteristics
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Flavor", value: food.flavor?.toLowerCase() },
                    { label: "Spice Level", value: spiceLevel },
                    { label: "Dietary", value: dietary },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-400">{item.label}</span>
                      <span className="font-medium capitalize">
                        {item.value || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
              <h3 className="font-semibold text-lg mb-3 text-white flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-orange-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Ingredients
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 pl-2">
                {ingredients.split(",").map((ingredient, index) => (
                  <li key={index} className="capitalize">
                    {ingredient.trim()}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            {tags && tags !== "N/A" && (
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                <h3 className="font-semibold text-lg mb-3 text-white flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-orange-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-700/70 text-white px-3 py-1 rounded-full text-sm hover:bg-gray-600/70 transition-colors"
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
