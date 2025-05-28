"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MenuFoodCard from "@/components/MenuFoodCard";
import CategoryFoodCard from "@/components/CategoryFoodCard";

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Base URL for the backend
  const BASE_URL = "https://smartmenu-backend.up.railway.app";

  // Fetch foods and derive categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const foodsResponse = await fetch(`${BASE_URL}/api/foods`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!foodsResponse.ok) {
          throw new Error(`Failed to fetch foods: ${foodsResponse.statusText}`);
        }
        const foodsData = await foodsResponse.json();

        const uniqueCategories = [
          ...new Set(foodsData.map((food) => food.category)),
        ].map((categoryName) => {
          const imageFileName =
            categoryName.toLowerCase().replace(/\s+/g, "") + ".png";
          return {
            _id: categoryName.toLowerCase().replace(/\s+/g, "-"),
            name: categoryName,
            image: `/category-images/${imageFileName}` || "placeholder.png",
          };
        });

        setCategories(uniqueCategories);
        setFoods(foodsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter foods based on search query
  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/70 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center">
            {/* Animated Title */}
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center mb-6">
              <span className="bg-gradient-to-r from-orange-500 via-amber-600 to-orange-500 dark:from-orange-400 dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent animate-gradient-x">
                Culinary Delights
              </span>
            </h1>

            {/* Search Bar */}
            <div className="relative w-full max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-4 text-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 hover:shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-4 text-xl font-medium text-gray-700 dark:text-gray-300">
                Crafting your menu...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-red-500 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              We're having trouble loading the menu. Please refresh or try again
              later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        )}

        {/* Success State */}
        {!loading && !error && (
          <div className="space-y-10">
            {/* Search Results or Category Grid */}
            {searchQuery ? (
              filteredFoods.length === 0 ? (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                      No foods found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      We couldn't find any foods matching "{searchQuery}". Try a different search term.
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFoods.map((food) => (
                    <CategoryFoodCard
                      key={food._id}
                      food={food}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <MenuFoodCard
                    key={category._id}
                    category={category}
                    foods={foods}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MenuPage;