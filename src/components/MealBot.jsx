import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MealBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("recommendations");
  const [isGenerating, setIsGenerating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Form state
  const [mealType, setMealType] = useState("Breakfast");
  const [cuisine, setCuisine] = useState("");
  const [dietaryPrefs, setDietaryPrefs] = useState({
    vegan: false,
    vegetarian: false,
    glutenFree: false,
  });
  const [includeIngredients, setIncludeIngredients] = useState("");
  const [excludeIngredients, setExcludeIngredients] = useState("");
  const [calorieGoal, setCalorieGoal] = useState();
  const [carbGoal, setCarbGoal] = useState();
  const [budget, setBudget] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  // Results state
  const [meals, setMeals] = useState([]);
  const [bucket, setBucket] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL =
    "https://food-recommendation-bot-v1-production.up.railway.app";

  // Animation for AI thinking
  useEffect(() => {
    if (isGenerating) {
      const timer = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(timer);
    }
  }, [isGenerating]);

  const handleDietaryChange = (e) => {
    const { name, checked } = e.target;
    setDietaryPrefs((prev) => ({ ...prev, [name]: checked }));
  };

  const collectFormData = () => {
    const dietary_filters = [];
    if (dietaryPrefs.vegan) dietary_filters.push("Vegan");
    if (dietaryPrefs.vegetarian) dietary_filters.push("Vegetarian");
    if (dietaryPrefs.glutenFree) dietary_filters.push("Gluten-Free");

    const include_ingredients = includeIngredients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const exclude_ingredients = excludeIngredients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      meal_type: mealType,
      origin: cuisine,
      calorie_goal: parseInt(calorieGoal) || 1000,
      carb_goal: parseInt(carbGoal) || 80,
      budget: parseInt(budget) || 1000,
      dietary_filters,
      include_ingredients,
      exclude_ingredients,
    };
  };

  const handleGetMealPlan = async () => {
    setLoading(true);
    setIsGenerating(true);
    setError(null);

    const payload = collectFormData();

    try {
      const response = await fetch(`${BASE_URL}/meal_plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch meal plan: ${response.status}`);
      }

      const data = await response.json();
      setMeals(data.meals || []);
      setActiveTab("results");
    } catch (err) {
      setError(err.message);
      console.error("Error fetching meal plan:", err);
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const handleSearchFoods = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a food name.");
      return;
    }

    setSearchLoading(true);
    setError(null);

    const payload = collectFormData();
    payload.name = searchQuery.trim();

    try {
      const response = await fetch(`${BASE_URL}/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to search foods: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.foods || []);
    } catch (err) {
      setError(err.message);
      console.error("Error searching foods:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const addToBucket = (item) => {
    setBucket((prev) => [...prev, item]);
  };

  const removeFromBucket = (index) => {
    setBucket((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = bucket.reduce((sum, meal) => sum + (meal.price_LKR || 0), 0);

  const filteredMeals = meals.filter((meal) =>
    meal.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderThinkingAnimation = () => {
    const dots = [".", "..", "...", "...."];

    return (
      <div className="relative flex items-center justify-center min-h-[200px] py-12">
        {/* Floating orb background effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-orange-500/10 blur-3xl animate-float"></div>
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-amber-400/10 blur-3xl animate-float-delay"></div>
        </div>

        {/* Main content */}
        <div className="relative text-center z-10">
          {/* Animated neural network inspired icon */}
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 opacity-90 shadow-lg shadow-orange-500/20 animate-pulse-slow"></div>
              <div className="absolute inset-1.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>

              {/* Floating particles */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/30"
                  style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    top: `${Math.random() * 60 + 10}%`,
                    left: `${Math.random() * 60 + 10}%`,
                    animation: `float-particle ${
                      3 + Math.random() * 4
                    }s infinite ease-in-out ${i * 0.3}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 bg-clip-text  bg-gradient-to-r from-orange-500 to-amber-600">
            Crafting your perfect meal plan
          </h3>

          <div className="flex justify-center items-center">
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Analyzing preferences
            </p>
            <span className="ml-1 text-orange-500 w-6 inline-block text-left">
              {dots[animationStep]}
            </span>
          </div>

          {/* Progress indicator */}
          <div className="mt-6 w-48 mx-auto h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full animate-progress"
              style={{ width: `${(animationStep + 1) * 25}%` }}
            ></div>
          </div>
        </div>

        {/* Add these to your global CSS */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-15px) translateX(10px);
            }
          }
          @keyframes float-particle {
            0%,
            100% {
              transform: translate(0, 0);
              opacity: 0.8;
            }
            50% {
              transform: translate(5px, -10px);
              opacity: 0.3;
            }
          }
          @keyframes pulse-slow {
            0%,
            100% {
              opacity: 0.9;
              transform: scale(1);
            }
            50% {
              opacity: 0.6;
              transform: scale(1.02);
            }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          .animate-float-delay {
            animation: float 8s ease-in-out infinite 1s;
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
          }
          .animate-progress {
            transition: width 0.3s ease-out;
          }
        `}</style>
      </div>
    );
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }} className="fixed bottom-6 right-6 z-50 group">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-orange-500/30 blur-md scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

        {/* Main button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-400/30 group-hover:scale-105 group-active:scale-95"
        >
          {/* Animated border */}
          <div className="absolute inset-0 rounded-full border-2 border-white/10 group-hover:border-white/30 transition-all duration-500"></div>

          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/80"
              style={{
                width: `${Math.random() * 3 + 2}px`,
                height: `${Math.random() * 3 + 2}px`,
                top: `${Math.random() * 40 + 30}%`,
                left: `${Math.random() * 40 + 30}%`,
                animation: `float-particle ${
                  3 + Math.random() * 2
                }s infinite ease-in-out ${i * 0.2}s`,
              }}
            ></div>
          ))}

          {/* Animated icon */}
          <div className="relative group-hover:rotate-12 transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white drop-shadow-sm"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 3v18m8-18l-2 5 2 5m0-5h4"
              />
            </svg>
          </div>

          {/* Plus sign that appears on hover */}
          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="absolute h-0.5 w-5 bg-white rounded-full"></div>
            <div className="absolute h-5 w-0.5 bg-white rounded-full"></div>
          </div>
        </button>

        {/* Tooltip */}
        <div className="absolute right-20 bottom-4 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl">
          Generate Meal Plan
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>

        {/* Add to your global CSS */}
        <style jsx>{`
          @keyframes float-particle {
            0%,
            100% {
              transform: translate(0, 0);
              opacity: 0.8;
            }
            50% {
              transform: translate(2px, -5px);
              opacity: 0.3;
            }
          }
        `}</style>
      </motion.div>

      {/* Modal */}
      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl m-3 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                <h1 className="text-2xl font-bold">AI Meal Assistant</h1>
                <p className="text-orange-100">
                  Get personalized meal recommendations
                </p>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("recommendations")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "recommendations"
                        ? "border-orange-500 text-orange-600 dark:text-orange-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Recommendations
                  </button>
                  <button
                    onClick={() => setActiveTab("results")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "results"
                        ? "border-orange-500 text-orange-600 dark:text-orange-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Results
                  </button>
                  <button
                    onClick={() => setActiveTab("bucket")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "bucket"
                        ? "border-orange-500 text-orange-600 dark:text-orange-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Bucket ({bucket.length})
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
                {/* Recommendations Tab */}
                {activeTab === "recommendations" && (
                  <>
                    {isGenerating ? (
                      renderThinkingAnimation()
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Tell us about your preferences
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Our AI will analyze your inputs to create the
                            perfect meal plan.
                          </p>
                        </div>

                        <div className="space-y-6">
                          {/* Meal Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Meal Type
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {["Breakfast", "Lunch", "Dinner", "Snack"].map(
                                (type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() => setMealType(type)}
                                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                      mealType === type
                                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    }`}
                                  >
                                    {type}
                                  </button>
                                )
                              )}
                            </div>
                          </div>

                          {/* Cuisine */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Cuisine Preference
                            </label>
                            <select
                              value={cuisine}
                              onChange={(e) => setCuisine(e.target.value)}
                              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:text-gray-100"
                            >
                              {[
                                "Any",
                                "Indian",
                                "Italian",
                                "Sri Lankan",
                                "Thai",
                                "Chinese",
                                "Mexican",
                              ].map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Dietary Preferences */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Dietary Preferences
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {[
                                { label: "Vegan", name: "vegan" },
                                { label: "Vegetarian", name: "vegetarian" },
                                { label: "Gluten-Free", name: "glutenFree" },
                              ].map((pref) => (
                                <label
                                  key={pref.name}
                                  className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                                    dietaryPrefs[pref.name]
                                      ? "bg-orange-100 dark:bg-orange-900/30"
                                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    name={pref.name}
                                    checked={dietaryPrefs[pref.name]}
                                    onChange={handleDietaryChange}
                                    className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                                  />
                                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                                    {pref.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Ingredients */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Include Ingredients
                              </label>
                              <input
                                type="text"
                                value={includeIngredients}
                                onChange={(e) =>
                                  setIncludeIngredients(e.target.value)
                                }
                                placeholder="e.g., tomatoes, basil, chicken"
                                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:text-gray-100"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Exclude Ingredients
                              </label>
                              <input
                                type="text"
                                value={excludeIngredients}
                                onChange={(e) =>
                                  setExcludeIngredients(e.target.value)
                                }
                                placeholder="e.g., onions, garlic, dairy"
                                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:text-gray-100"
                              />
                            </div>
                          </div>

                          {/* Nutrition Goals */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Calorie Goal
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={calorieGoal}
                                  onChange={(e) =>
                                    setCalorieGoal(e.target.value)
                                  }
                                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:text-gray-100"
                                />
                                <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 text-sm">
                                  kcal
                                </span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Carb Goal
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={carbGoal}
                                  onChange={(e) => setCarbGoal(e.target.value)}
                                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:text-gray-100"
                                />
                                <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 text-sm">
                                  g
                                </span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Budget
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 text-sm">
                                  LKR
                                </span>
                                <input
                                  type="number"
                                  value={budget}
                                  onChange={(e) => setBudget(e.target.value)}
                                  className="w-full p-3 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:text-gray-100"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Error Message */}
                          {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                              {error}
                            </div>
                          )}

                          {/* Generate Button */}
                          <button
                            onClick={handleGetMealPlan}
                            disabled={loading}
                            className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-400/30"
                          >
                            Generate AI Recommendations
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Results Tab */}
                {activeTab === "results" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Your Personalized Recommendations
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Based on your preferences, here's what our AI suggests:
                      </p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (e.target.value.trim()) handleSearchFoods();
                        }}
                        placeholder="Search within recommendations..."
                        className="w-full p-3 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:text-gray-100"
                      />
                      <div className="absolute left-3 top-3 text-gray-400">
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
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    {loading ? (
                      renderThinkingAnimation()
                    ) : (
                      <>
                        {filteredMeals.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-orange-500"
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
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                              No recommendations yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                              Generate meal recommendations based on your
                              preferences
                            </p>
                            <button
                              onClick={() => setActiveTab("recommendations")}
                              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                              Go to Preferences
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4">
                            {filteredMeals.map((meal) => (
                              <div
                                key={meal.id}
                                className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                      {meal.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                                        {meal.calories} kcal
                                      </span>
                                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                                        {meal.carbs}g carbs
                                      </span>
                                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                                        LKR {meal.price_LKR || 0}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => addToBucket(meal)}
                                    className="self-start px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Bucket Tab */}
                {activeTab === "bucket" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Your Meal Bucket
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Review your selected meals before checkout
                      </p>
                    </div>

                    {bucket.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-orange-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                          Your bucket is empty
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                          Add meals from recommendations to get started
                        </p>
                        <button
                          onClick={() => setActiveTab("results")}
                          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Browse Recommendations
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {bucket.map((item, index) => (
                            <div
                              key={`${item.id}-${index}`}
                              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {item.name}
                                  </h3>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                                      {item.calories} kcal
                                    </span>
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                                      {item.carbs}g carbs
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    LKR {item.price_LKR || 0}
                                  </span>
                                  <button
                                    onClick={() => removeFromBucket(index)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              Subtotal:
                            </span>
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                              LKR {subtotal}
                            </span>
                          </div>
                          <button className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-400/30">
                            Proceed to Checkout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default MealBot;
