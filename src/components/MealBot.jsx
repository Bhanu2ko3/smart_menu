import { useState } from "react";

const MealBot = () => {
  // State for modal visibility
  const [isOpen, setIsOpen] = useState(false);

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
  const [calorieGoal, setCalorieGoal] = useState(1000);
  const [carbGoal, setCarbGoal] = useState(80);
  const [budget, setBudget] = useState(1000);
  const [searchQuery, setSearchQuery] = useState("");

  // State for meal suggestions and bucket
  const [meals, setMeals] = useState([]);
  const [bucket, setBucket] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  // Backend API URL - matching the working HTML version
  const BASE_URL = "https://food-recommendation-bot-v1-production.up.railway.app";

  // Handle dietary preference checkbox changes
  const handleDietaryChange = (e) => {
    const { name, checked } = e.target;
    setDietaryPrefs((prev) => ({ ...prev, [name]: checked }));
  };

  // Collect form data - matching HTML version structure
  const collectFormData = () => {
    const dietary_filters = [];
    if (dietaryPrefs.vegan) dietary_filters.push("Vegan");
    if (dietaryPrefs.vegetarian) dietary_filters.push("Vegetarian");
    if (dietaryPrefs.glutenFree) dietary_filters.push("Gluten-Free");

    const include_ingredients = includeIngredients
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    
    const exclude_ingredients = excludeIngredients
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    return {
      meal_type: mealType,
      origin: cuisine,
      calorie_goal: parseInt(calorieGoal) || 1000,
      carb_goal: parseInt(carbGoal) || 80,
      budget: parseInt(budget) || 1000,
      dietary_filters,
      include_ingredients,
      exclude_ingredients
    };
  };

  // Handle form submission to get meal plan - matching HTML version
  const handleGetMealPlan = async () => {
    setLoading(true);
    setError(null);

    const payload = collectFormData();

    try {
      console.log("Fetching meal plan from:", `${BASE_URL}/meal_plan`);
      console.log("Request payload:", payload);

      const response = await fetch(`${BASE_URL}/meal_plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch meal plan: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Handle response structure matching HTML version
      const items = data.meals || [];
      setMeals(items);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching meal plan:", err);
      setLoading(false);
    }
  };

  // Handle food search - matching HTML version
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
      console.log("Searching foods from:", `${BASE_URL}/recommendations`);
      console.log("Search payload:", payload);

      const response = await fetch(`${BASE_URL}/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to search foods: ${response.status}`);
      }

      const data = await response.json();
      console.log("Search API Response:", data);

      // Handle response structure matching HTML version
      const items = data.foods || [];
      setSearchResults(items);
      setSearchLoading(false);
    } catch (err) {
      setError(err.message);
      console.error("Error searching foods:", err);
      setSearchLoading(false);
    }
  };

  // Add item to bucket
  const addToBucket = (item) => {
    setBucket(prev => [...prev, item]);
  };

  // Remove item from bucket
  const removeFromBucket = (index) => {
    setBucket(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate subtotal
  const subtotal = bucket.reduce((sum, meal) => sum + (meal.price_LKR || 0), 0);

  // Filter meals based on search query
  const filteredMeals = meals.filter(meal =>
    meal.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Circular Bot Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
              d="M8 3v18m8-18l-2 5 2 5m0-5h4"
            />
          </svg>
        </button>
      </div>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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

            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Plan Your Perfect Meal
            </h1>

            <form onSubmit={(e) => { e.preventDefault(); handleGetMealPlan(); }} className="space-y-6">
              {/* Meal Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meal Type
                </label>
                <div className="flex flex-wrap gap-4">
                  {["Breakfast", "Lunch", "Dinner", "Snack"].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="mealType"
                        value={type}
                        checked={mealType === type}
                        onChange={(e) => setMealType(e.target.value)}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cuisine */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cuisine
                </label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-gray-100"
                >
                  {["Any", "Indian", "Italian", "Sri Lankan", "Thai"].map((option) => (
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
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: "Vegan", name: "vegan" },
                    { label: "Vegetarian", name: "vegetarian" },
                    { label: "Gluten-Free", name: "glutenFree" },
                  ].map((pref) => (
                    <label key={pref.name} className="flex items-center">
                      <input
                        type="checkbox"
                        name={pref.name}
                        checked={dietaryPrefs[pref.name]}
                        onChange={handleDietaryChange}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{pref.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Include Ingredients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Include Ingredients (comma-separated)
                </label>
                <input
                  type="text"
                  value={includeIngredients}
                  onChange={(e) => setIncludeIngredients(e.target.value)}
                  placeholder="e.g., tomatoes, basil"
                  className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-gray-100"
                />
              </div>

              {/* Exclude Ingredients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Exclude Ingredients (comma-separated)
                </label>
                <input
                  type="text"
                  value={excludeIngredients}
                  onChange={(e) => setExcludeIngredients(e.target.value)}
                  placeholder="e.g., onions, garlic"
                  className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-gray-100"
                />
              </div>

              {/* Goals and Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Calorie Goal
                  </label>
                  <input
                    type="number"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(e.target.value)}
                    placeholder="e.g., 500"
                    className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Carb Goal (g)
                  </label>
                  <input
                    type="number"
                    value={carbGoal}
                    onChange={(e) => setCarbGoal(e.target.value)}
                    placeholder="e.g., 50"
                    className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget (LKR)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g., 2000"
                    className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
                } focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors duration-300`}
              >
                {loading ? "Loading..." : "Get Meal Plan"}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
                {error}
              </div>
            )}

            {/* Meal Plan Results */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Meal Plan Suggestions
              </h2>
              {meals.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No meal plans yet. Generate a meal plan to see suggestions!</p>
              ) : (
                <ul className="space-y-4">
                  {filteredMeals.map((meal) => (
                    <li key={meal.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{meal.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Calories: {meal.calories} | Carbs: {meal.carbs}g | Price: LKR {meal.price_LKR || 0}
                        </p>
                      </div>
                      <button
                        onClick={() => addToBucket(meal)}
                        className="ml-4 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        Add to Bucket
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Search Foods Section */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Search Foods
              </h2>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim()) handleSearchFoods();
                  }}
                  placeholder="Search meals in your bucket..."
                  className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-gray-100 pr-10"
                />
                <button
                  onClick={handleSearchFoods}
                  disabled={searchLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
              {searchLoading && <p className="text-gray-500 dark:text-gray-400">Searching...</p>}
              {searchResults.length > 0 && (
                <ul className="space-y-4">
                  {searchResults.map((result) => (
                    <li key={result.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{result.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Calories: {result.calories} | Carbs: {result.carbs}g | Price: LKR {result.price_LKR || 0}
                        </p>
                      </div>
                      <button
                        onClick={() => addToBucket(result)}
                        className="ml-4 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        Add to Bucket
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Bucket Contents */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Your Meal Bucket
              </h2>
              {bucket.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Your bucket is empty. Add meals to see them here!</p>
              ) : (
                <>
                  <ul className="space-y-4">
                    {bucket.map((item, index) => (
                      <li key={item.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Calories: {item.calories} | Carbs: {item.carbs}g | Price: LKR {item.price_LKR || 0}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromBucket(index)}
                          className="ml-4 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Subtotal: LKR {subtotal}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MealBot;
