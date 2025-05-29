"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX, FiRefreshCw, FiFrown } from "react-icons/fi";
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
        setError(null);

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
          const imageFileName = categoryName.toLowerCase().replace(/\s+/g, "-") + ".png";
          return {
            _id: categoryName.toLowerCase().replace(/\s+/g, "-"),
            name: categoryName,
            image: `/category-images/${imageFileName}` || "placeholder.png",
          };
        });

        setCategories(uniqueCategories);
        setFoods(foodsData); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter foods based on search query
  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sticky Header */}
      <motion.header 
        className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/10 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex flex-col items-center">
            {/* Animated Title */}
            <motion.h1 
              className="text-4xl mt-2 sm:text-5xl font-extrabold tracking-tight text-center mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-orange-500 via-amber-600 to-orange-500 dark:from-orange-400 dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent animate-gradient-x">
                Delights
              </span>
            </motion.h1>

            {/* Search Bar */}
            <motion.div 
              className="relative w-full max-w-2xl mt-3 mb-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-4 text-lg bg-white/5 border border-gray-200/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-white placeholder-gray-400 transition-all duration-300 hover:shadow-sm"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <FiX className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="inline-flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <motion.p 
                className="mt-4 text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Loading delicious options...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-red-900/30 rounded-full mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <svg
                  className="w-10 h-10 text-red-400"
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
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Something went wrong
              </h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                We're having trouble loading the menu. Please refresh or try again
                later.
              </p>
              <motion.button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiRefreshCw className="inline mr-2" />
                Refresh Page
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success State */}
        <AnimatePresence>
          {!loading && !error && (
            <motion.div 
              className="space-y-10"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {/* Search Results or Category Grid */}
              {searchQuery ? (
                filteredFoods.length === 0 ? (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div 
                      className="w-20 h-20 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center"
                      whileHover={{ rotate: 10 }}
                    >
                      <FiFrown className="w-10 h-10 text-gray-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      No foods found
                    </h3>
                    <p className="text-gray-400 mb-6">
                      We couldn't find any foods matching "{searchQuery}". Try a
                      different search term.
                    </p>
                    <motion.button
                      onClick={() => setSearchQuery("")}
                      className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium rounded-lg transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear Search
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                  >
                    {filteredFoods.map((food, index) => (
                      <motion.div
                        key={food._id}
                        variants={itemVariants}
                        custom={index}
                      >
                        <CategoryFoodCard food={food} />
                      </motion.div>
                    ))}
                  </motion.div>
                )
              ) : (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                >
                  {categories.map((category, index) => (
                    <motion.div
                      key={category._id}
                      variants={itemVariants}
                      custom={index}
                    >
                      <MenuFoodCard
                        category={category}
                        foods={foods}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MenuPage;