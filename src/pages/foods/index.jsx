"use client";
import { useState, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useSearchParams } from "next/navigation";
import CategoryFoodCard from "@/components/CategoryFoodCard";

import MealBot from "@/components/MealBot";

const FoodsByCategory = () => {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(null); // Initialize as null
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("price-asc"); // Default sort: price low to high

  // Base URL for the backend
  const BASE_URL = "https://smartmenu-backend.up.railway.app";

  // Extract category after component mounts
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    setCategory(categoryParam);
  }, [searchParams]);

  // Fetch foods once category is available
  useEffect(() => {
    const fetchFoods = async () => {
      if (!category) {
        setError("No category selected");
        setLoading(false);
        return;
      }

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
        const decodedCategory = decodeURIComponent(category)
          .toLowerCase()
          .trim();
        const filteredFoods = foodsData.filter(
          (food) => food.category?.toLowerCase().trim() === decodedCategory
        );
        console.log("Filtered foods:", filteredFoods); // Debug log

        setFoods(filteredFoods);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (category !== null) {
      fetchFoods();
    }
  }, [category]);


  // Filter and sort foods
  const filteredFoods = foods
    .filter((food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  // Sort foods
  const sortedFoods = foods.sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center py-16 sm:py-20">
          <div className="w-16 h-16 mx-auto mb-6 animate-spin rounded-full border-4 border-t-orange-500 border-gray-200 dark:border-gray-700"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Loading foods...
          </h3>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center py-16 sm:py-20">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {error || "No category selected!"} Please try again later or contact
            support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-center bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-6">
            {decodeURIComponent(category)}
          </h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sort Dropdown */}
        <div className="mb-6 flex justify-end">
          <div className="w-full sm:w-48">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
        {sortedFoods.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No foods found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">

                We couldn't find any foods matching your search. Try adjusting
                your search terms.

                We couldn't find any foods in this category.

              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFoods.map((food) => (
              <CategoryFoodCard
                key={food._id}

                onClick={() => {
                  console.log("Navigating to foodId:", food._id); // Debug log
                  router.push(`/foodOverview?foodId=${food._id}`);
                }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] min-h-[200px]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={food.imageUrl || "/placeholder-food.jpg"}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                  <div className="text-white space-y-0.5">
                    <h2 className="text-base sm:text-lg font-bold leading-tight group-hover:text-orange-300 transition-colors duration-200">
                      {food.name}
                    </h2>
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center space-x-1">
                        <svg
                          className="w-3 h-3 text-orange-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs font-medium text-gray-200">
                          ${food.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg
                          className="w-3 h-3 text-orange-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs font-medium text-gray-200">
                          {food.rating} ★
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-200 line-clamp-2">
                      {food.description || "No description available"}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

                food={food}
              />

            ))}
          </div>
        )}
      </div>
<<<<<<< HEAD
=======


      

      <MealBot />

>>>>>>> eba9651992719a572d7b6e8fda7adf15b08372a9
    </div>
  );
};

export default FoodsByCategory;
