"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../../contexts/CartContext";
import ModelViewer from "@/components/ModelViewer";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer, slideIn, zoomIn } from "@/utils/motion";

export default function FoodOverview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [foodId, setFoodId] = useState(null);
  const { addToCart } = useCart();
  const [activeModel, setActiveModel] = useState(null);
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modelViewerRef = useRef();

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
        setFood(foodData);
        setActiveModel(foodData.model3DUrl || null);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (foodId !== null) {
      fetchFood();
    }
  }, [foodId]);

  const AddToCart = () => {
    addToCart({
      id: food._id,
      name: food.name,
      price: food.price,
      image: food.imageUrl || "",
      description: food.description,
    });
    
    // Trigger animation
    const button = document.querySelector('.add-to-cart-button');
    button.classList.add('animate-ping-once');
    setTimeout(() => {
      button.classList.remove('animate-ping-once');
    }, 500);
  };

  // Format data
  const dietary = food?.dietary || "N/A";
  const ingredients = Array.isArray(food?.ingredients)
    ? food.ingredients.join(", ")
    : "N/A";
  const tags = Array.isArray(food?.tags) ? food.tags.join(", ") : "N/A";
  const availability = food?.availability ? "In Stock" : "Out of Stock";
  const preparationTime = food?.preparationTime
    ? `${food.preparationTime} mins`
    : "N/A";
  const spiceLevel = food?.spiceLevel
    ? {
        0: "None",
        1: "Mild",
        2: "Medium",
        3: "Hot",
        4: "Very Hot",
        5: "Extreme",
      }[food.spiceLevel] || "N/A"
    : "N/A";

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-t-orange-500 border-gray-200"
        ></motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center"
      >
        <motion.div
          variants={zoomIn(0.2, 1)}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Error</h3>
          <p className="text-gray-400">{error}</p>
        </motion.div>
      </motion.div>
    );
  }

  if (!food) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center"
      >
        <motion.div
          variants={zoomIn(0.2, 1)}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Not Found</h3>
          <p className="text-gray-400">Food not found!</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
    >
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-md border-b border-gray-200/70 dark:border-gray-700/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl mt-2 sm:text-5xl font-extrabold tracking-tight text-center mb-4"
            >
              <span className="bg-gradient-to-r from-orange-500 via-amber-600 to-orange-500 dark:from-orange-400 dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent animate-gradient-x">
                Delights
              </span>
            </motion.h1>
          </div>
        </div>
      </motion.header>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto p-6 pt-6"
      >
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Food Image & Model Viewer */}
          <motion.div
            variants={fadeIn('right', 'tween', 0.2, 1)}
            className="w-full lg:w-1/2"
          >
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-gray-700/50">
              <AnimatePresence mode="wait">
                {activeModel ? (
                  <motion.div
                    key="model"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <ModelViewer
                      src={activeModel}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ) : (
                  <motion.img
                    key="image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={food.imageUrl || "/placeholder-food.jpg"}
                    alt={food.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-food.jpg";
                    }}
                  />
                )}
              </AnimatePresence>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-4 left-4 flex gap-2"
              >
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
              </motion.div>
            </div>
          </motion.div>

          {/* Food Details */}
          <motion.div
            variants={fadeIn('left', 'tween', 0.2, 1)}
            className="w-full lg:w-1/2 space-y-6"
          >
            {/* Header Section */}
            <motion.div variants={staggerContainer} className="space-y-3">
              <motion.div
                variants={fadeIn('up', 'tween', 0.2, 1)}
                className="flex justify-between items-start gap-4"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {food.name}
                </h1>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center bg-orange-500/90 px-3 py-1 rounded-full shadow-md"
                >
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
                </motion.div>
              </motion.div>

              <motion.div
                variants={fadeIn('up', 'tween', 0.3, 1)}
                className="flex items-center gap-3 text-gray-300"
              >
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
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeIn('up', 'tween', 0.4, 1)}
              className="text-gray-300 leading-relaxed"
            >
              {food.description ||
                "No description available for this delicious dish."}
            </motion.p>

            {/* Price & Availability */}
            <motion.div
              variants={fadeIn('up', 'tween', 0.5, 1)}
              className="p-5 bg-gray-800/50 rounded-xl border border-gray-700/50"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-3xl font-bold text-orange-400">
                  LKR {food.price ? food.price.toFixed(2) : "0.00"}
                </span>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    availability === "In Stock"
                      ? "bg-green-900/30 text-green-400 border border-green-400/30"
                      : "bg-red-900/30 text-red-400 border border-red-400/30"
                  }`}
                >
                  {availability}
                </motion.span>
              </div>
              {food.servingSize && (
                <p className="text-sm text-gray-400">
                  Serving size: {food.servingSize}
                </p>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={fadeIn('up', 'tween', 0.6, 1)}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={AddToCart}
                className="add-to-cart-button flex-1 bg-orange-500 hover:bg-orange-600 py-3 px-6 rounded-xl flex items-center justify-center gap-3 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-orange-500/20"
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
              </motion.button>
            </motion.div>

            {/* Detailed Information Sections */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4"
            >
              {/* Nutrition Information */}
              <motion.div
                variants={fadeIn('up', 'tween', 0.3, 1)}
                className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50"
              >
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
                    <motion.div
                      key={index}
                      variants={fadeIn('up', 'tween', 0.4 + index * 0.1, 1)}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-400">{item.label}</span>
                      <span className="font-medium">
                        {item.value ? `${item.value}${item.unit}` : "-"}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Food Characteristics */}
              <motion.div
                variants={fadeIn('up', 'tween', 0.4, 1)}
                className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50"
              >
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
                    <motion.div
                      key={index}
                      variants={fadeIn('up', 'tween', 0.5 + index * 0.1, 1)}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-400">{item.label}</span>
                      <span className="font-medium capitalize">
                        {item.value || "-"}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Ingredients */}
            <motion.div
              variants={fadeIn('up', 'tween', 0.5, 1)}
              className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50"
            >
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
                  <motion.li
                    key={index}
                    variants={fadeIn('up', 'tween', 0.6 + index * 0.05, 1)}
                    className="capitalize"
                  >
                    {ingredient.trim()}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Tags */}
            {tags && tags !== "N/A" && (
              <motion.div
                variants={fadeIn('up', 'tween', 0.6, 1)}
                className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50"
              >
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
                    <motion.span
                      key={index}
                      variants={fadeIn('up', 'tween', 0.7 + index * 0.05, 1)}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gray-700/70 text-white px-3 py-1 rounded-full text-sm hover:bg-gray-600/70 transition-colors"
                    >
                      {tag.trim()}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}