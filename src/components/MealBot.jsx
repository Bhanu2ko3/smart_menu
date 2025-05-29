import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MealBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("recommendations");
  const [isGenerating, setIsGenerating] = useState(false);

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
  const [calorieGoal, setCalorieGoal] = useState("");
  const [carbGoal, setCarbGoal] = useState("");
  const [budget, setBudget] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Results state
  const [meals, setMeals] = useState([]);
  const [bucket, setBucket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = "https://food-recommendation-bot-v1-production.up.railway.app";

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

    setLoading(true);
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
      setMeals(data.foods || []);
    } catch (err) {
      setError(err.message);
      console.error("Error searching foods:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToBucket = (item) => {
    setBucket((prev) => [...prev, item]);
    // Add a subtle animation effect
    const button = document.getElementById(`add-btn-${item.id}`);
    if (button) {
      button.classList.add("animate-ping");
      setTimeout(() => button.classList.remove("animate-ping"), 500);
    }
  };

  const removeFromBucket = (index) => {
    setBucket((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = bucket.reduce((sum, meal) => sum + (meal.price_LKR || 0), 0);

  const filteredMeals = meals.filter((meal) =>
    meal.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderThinkingAnimation = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </motion.div>
      <motion.h3 
        className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2"
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Crafting your perfect meal plan
      </motion.h3>
      <motion.p 
        className="text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Analyzing your preferences...
      </motion.p>
    </motion.div>
  );

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50"
      >
        {/* Main button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-13 h-13 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-400/30 group-hover:scale-105 group-active:scale-95 overflow-visible"
        >
          {/* 🔥 Smoke/Glow aura effect */}
          <span className="absolute -inset-2 rounded-full bg-orange-400 blur-xl opacity-40 animate-pulse-glow z-[-1]"></span>

          {/* Animated border */}
          <div className="absolute inset-0 rounded-lg border-2 border-white/10 group-hover:border-white/30 transition-all duration-500"></div>

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
          <div className="relative group-hover:rotate-12 transition-transform duration-300"></div>
        </button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-gray-900 rounded-2xl m-3 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative"
            >
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
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
                <h1 className="text-2xl font-bold">Meal Planner</h1>
                <p className="text-orange-100 opacity-90">
                  AI-powered meal recommendations
                </p>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex -mb-px">
                  {["recommendations", "results", "bucket"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? "border-orange-500 text-orange-600 dark:text-orange-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      {tab === "bucket" ? `Bucket (${bucket.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
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
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Your Preferences
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400">
                            Let us know what you're craving
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
                                  <motion.button
                                    key={type}
                                    type="button"
                                    onClick={() => setMealType(type)}
                                    whileTap={{ scale: 0.95 }}
                                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                      mealType === type
                                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    }`}
                                  >
                                    {type}
                                  </motion.button>
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
                                <motion.label
                                  key={pref.name}
                                  whileTap={{ scale: 0.95 }}
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
                                </motion.label>
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
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg"
                            >
                              {error}
                            </motion.div>
                          )}

                          {/* Generate Button */}
                          <motion.button
                            onClick={handleGetMealPlan}
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg shadow hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300/50"
                          >
                            Generate Recommendations
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Results Tab */}
                {activeTab === "results" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Your Recommendations
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        Based on your preferences
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
                        placeholder="Search recommendations..."
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
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                          >
                            <div className="mx-auto w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-orange-500"
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
                              Generate meal recommendations based on your preferences
                            </p>
                            <motion.button
                              onClick={() => setActiveTab("recommendations")}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                              Go to Preferences
                            </motion.button>
                          </motion.div>
                        ) : (
                          <div className="grid grid-cols-1 gap-3">
                            {filteredMeals.map((meal) => (
                              <motion.div
                                key={meal.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow transition-shadow"
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
                                  <motion.button
                                    id={`add-btn-${meal.id}`}
                                    onClick={() => addToBucket(meal)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="self-start px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                                  >
                                    Add
                                  </motion.button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}

                {/* Bucket Tab */}
                {activeTab === "bucket" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Your Meal Bucket
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        {bucket.length} item{bucket.length !== 1 ? 's' : ''} selected
                      </p>
                    </div>

                    {bucket.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <div className="mx-auto w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-orange-500"
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
                          Add meals from recommendations
                        </p>
                        <motion.button
                          onClick={() => setActiveTab("results")}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Browse Recommendations
                        </motion.button>
                      </motion.div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {bucket.map((item, index) => (
                            <motion.div
                              key={`${item.id}-${index}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
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
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    LKR {item.price_LKR || 0}
                                  </span>
                                  <motion.button
                                    onClick={() => removeFromBucket(index)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
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
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
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
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg shadow hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300/50"
                          >
                            Proceed to Checkout
                          </motion.button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MealBot;