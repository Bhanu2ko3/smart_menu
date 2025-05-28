"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
        ].map((categoryName) => ({
          _id: categoryName.toLowerCase().replace(/\s+/g, "-"),
          name: categoryName,
          image: "/placeholder.png",
        }));

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

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (categoryName) => {
    console.log("Navigating to category:", categoryName); // Debug log
    router.push(`/foods?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-center bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-6">
            Our Menu
          </h1>
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 mx-auto mb-6 animate-spin rounded-full border-4 border-t-orange-500 border-gray-200 dark:border-gray-700"></div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Loading menu...
            </h3>
          </div>
        )}
        {error && !loading && (
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
              {error}. Please try again later or contact support.
            </p>
          </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category.name)}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] min-h-[200px]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                  <div className="text-white space-y-0.5">
                    <h2 className="text-base sm:text-lg font-bold leading-tight group-hover:text-orange-300 transition-colors duration-200">
                      {category.name}
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
                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs font-medium text-gray-200">
                          {foods.filter((food) => food.category === category.name).length} items
                        </span>
                      </div>
                    </div>
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
            ))}
          </div>
        )}
        {!loading && !error && filteredCategories.length === 0 && (
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
                No categories found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We couldn't find any categories matching your search. Try adjusting your search terms.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;