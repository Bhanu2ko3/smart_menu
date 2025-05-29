"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CategoryFoodCard from "@/components/CategoryFoodCard";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const headerVariants = {
  initial: { y: -50, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const sortVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.3,
      type: "spring",
      stiffness: 100,
    },
  },
};

const FoodsByCategory = () => {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(null);
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Added searchQuery state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("name-asc");

  const BASE_URL = "https://smartmenu-backend.up.railway.app";

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    setCategory(categoryParam);
  }, [searchParams]);

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

        const decodedCategory = decodeURIComponent(category)
          .toLowerCase()
          .trim();
        const filteredFoods = foodsData.filter(
          (food) => food.category?.toLowerCase().trim() === decodedCategory
        );

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

  // Filter foods based on search query
  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered foods
  const sortedFoods = [...filteredFoods].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div className="text-center py-16 sm:py-20">
          <motion.div
            animate={{
              rotate: 360,
              transition: {
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-t-orange-500 border-gray-200 dark:border-gray-700"
          />
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-gray-900 dark:text-gray-100"
          >
            Loading foods...
          </motion.h3>
        </div>
      </motion.div>
    );
  }

  if (error || !category) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div className="text-center py-16 sm:py-20">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center"
          >
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
          </motion.div>
          <motion.h3
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
          >
            Error
          </motion.h3>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 leading-relaxed"
          >
            {error || "No category selected!"} Please try again later or contact
            support.
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <motion.header
        variants={headerVariants}
        initial="initial"
        animate="animate"
        className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-md border-b border-gray-200/70 dark:border-gray-700/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex flex-col items-center">
            <motion.h1
              className="text-4xl mt-2 sm:text-5xl font-extrabold tracking-tight text-center mb-3 break-words max-w-3xl text-balance"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-orange-500 via-amber-600 to-orange-500 dark:from-orange-400 dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent animate-gradient-x">
                {decodeURIComponent(category)}
              </span>
            </motion.h1>
            {/* Search Bar */}
            <div className="relative w-full max-w-2xl mt-3 mb-3">
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
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div
          variants={sortVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 flex justify-end"
        >
          <div className="relative w-full sm:w-48">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all cursor-pointer"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {sortedFoods.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 sm:py-20"
            >
              <div className="max-w-sm mx-auto">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    transition: { repeat: Infinity, duration: 2 },
                  }}
                  className="w-16 h-16 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"
                >
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
                </motion.div>
                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
                >
                  No foods found
                </motion.h3>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 leading-relaxed"
                >
                  {searchQuery
                    ? `No foods matching "${searchQuery}" in this category.`
                    : "We couldn't find any foods in this category."}
                </motion.p>
                {searchQuery && (
                  <motion.button
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
                  >
                    Clear Search
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="foods"
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {sortedFoods.map((food) => (
                <motion.div
                  key={food._id}
                  variants={item}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CategoryFoodCard food={food} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FoodsByCategory;