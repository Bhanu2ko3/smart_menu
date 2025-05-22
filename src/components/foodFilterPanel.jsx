"use client";
import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { allFoods } from "../data/foodData";

// Reusable UI components
const InputField = ({ label, placeholder, value, onChange, type = "text", id, min }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-sm font-medium">{label}</label>
    <input
      type={type}
      id={id}
      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      min={min}
      aria-label={label}
    />
  </div>
);

const RangeField = ({ label, minValue, maxValue, onMinChange, onMaxChange, idPrefix }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    <div className="flex space-x-2">
      <input
        type="number"
        id={`${idPrefix}-min`}
        className="w-1/2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
        placeholder="Min"
        value={minValue}
        onChange={onMinChange}
        min="0"
        aria-label={`${label} Minimum`}
      />
      <input
        type="number"
        id={`${idPrefix}-max`}
        className="w-1/2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
        placeholder="Max"
        value={maxValue}
        onChange={onMaxChange}
        min="0"
        aria-label={`${label} Maximum`}
      />
    </div>
  </div>
);

const SelectField = ({ label, options, value, onChange, id }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-sm font-medium">{label}</label>
    <select
      id={id}
      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
      value={value}
      onChange={onChange}
      aria-label={label}
    >
      {options.map((opt) => (
        <option key={opt} value={opt === "Any" ? "" : opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const CheckboxGroup = ({ label, options, values, onChange }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={values[opt] || false}
            onChange={() => onChange(opt)}
            aria-label={opt}
          />
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const CategoriesPanel = ({ activeCategory, categories = [], onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dietaryPreferences, setDietaryPreferences] = useState({
    Vegan: false,
    Vegetarian: false,
    "Gluten-Free": false,
    Keto: false,
    Organic: false,
    "Dairy-Free": false,
  });
  const [caloriesMin, setCaloriesMin] = useState("");
  const [caloriesMax, setCaloriesMax] = useState("");
  const [proteinMin, setProteinMin] = useState("");
  const [proteinMax, setProteinMax] = useState("");
  const [carbsMin, setCarbsMin] = useState("");
  const [carbsMax, setCarbsMax] = useState("");
  const [fatsMin, setFatsMin] = useState("");
  const [fatsMax, setFatsMax] = useState("");
  const [flavorProfile, setFlavorProfile] = useState("");
  const [spiceLevel, setSpiceLevel] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleDietaryChange = (preference) => {
    setDietaryPreferences((prev) => ({
      ...prev,
      [preference]: !prev[preference],
    }));
  };

  const resetFilters = () => {
    setDietaryPreferences({
      Vegan: false,
      Vegetarian: false,
      "Gluten-Free": false,
      Keto: false,
      Organic: false,
      "Dairy-Free": false,
    });
    setCaloriesMin("");
    setCaloriesMax("");
    setProteinMin("");
    setProteinMax("");
    setCarbsMin("");
    setCarbsMax("");
    setFatsMin("");
    setFatsMax("");
    setFlavorProfile("");
    setSpiceLevel("");
    setIngredients("");
    setServingSize("");
    setTags("");
    if (onFiltersChange) onFiltersChange(null);
  };

  const applyFilters = async () => {
    setIsLoading(true);
    setError(null);

    const payload = {
      dietary: Object.entries(dietaryPreferences)
        .filter(([_, value]) => value)
        .map(([key]) => key),
      flavor: flavorProfile || "",
      spice: spiceLevel || "",
      serving_size: servingSize || "",
      ingredients: ingredients
        ? ingredients.split(",").map((i) => i.trim()).filter(Boolean)
        : [],
      tags: tags
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      calories: caloriesMin ? Number(caloriesMin) : 0,
      calories_max: caloriesMax ? Number(caloriesMax) : undefined,
      protein: proteinMin ? Number(proteinMin) : 0,
      protein_max: proteinMax ? Number(proteinMax) : undefined,
      carbs: carbsMin ? Number(carbsMin) : 0,
      carbs_max: carbsMax ? Number(carbsMax) : undefined,
      fats: fatsMin ? Number(fatsMin) : 0,
      fats_max: fatsMax ? Number(fatsMax) : undefined,
    };

    // Validate nutritional ranges
    if (payload.calories_max && payload.calories && payload.calories_max < payload.calories) {
      setError("Max calories cannot be less than min calories");
      setIsLoading(false);
      return;
    }
    if (payload.protein_max && payload.protein && payload.protein_max < payload.protein) {
      setError("Max protein cannot be less than min protein");
      setIsLoading(false);
      return;
    }
    if (payload.carbs_max && payload.carbs && payload.carbs_max < payload.carbs) {
      setError("Max carbs cannot be less than min carbs");
      setIsLoading(false);
      return;
    }
    if (payload.fats_max && payload.fats && payload.fats_max < payload.fats) {
      setError("Max fats cannot be less than min fats");
      setIsLoading(false);
      return;
    }
    if (payload.calories < 0 || (payload.calories_max && payload.calories_max < 0) ||
        payload.protein < 0 || (payload.protein_max && payload.protein_max < 0) ||
        payload.carbs < 0 || (payload.carbs_max && payload.carbs_max < 0) ||
        payload.fats < 0 || (payload.fats_max && payload.fats_max < 0)) {
      setError("Nutritional values cannot be negative");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (onFiltersChange && data.recommendations && data.recommendations.length > 0) {
        const mappedRecommendations = data.recommendations.map((rec) => {
          const matchingFood = allFoods.find((food) => food.name === rec.name);
          return {
            id: matchingFood ? matchingFood.id : rec.name, // Map to numeric id from allFoods, fallback to name
            name: rec.name,
            price: rec.price || 0,
            serving_size: rec.serving_size || "",
            categoryId: rec.category_id || activeCategory || "",
            relevance: rec.relevance || 0,
          };
        });
        onFiltersChange({
          healthy: {
            recommendations: mappedRecommendations,
          },
        });
      } else if (onFiltersChange) {
        onFiltersChange({ healthy: { recommendations: [] } });
        throw new Error("No foods match your preferences. Try adjusting your filters.");
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || "Failed to fetch recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSearchFields = useMemo(() => (
    <div className="space-y-3 mt-4">
      <CheckboxGroup
        label="Dietary Preferences"
        options={["Vegan", "Vegetarian", "Gluten-Free", "Keto", "Organic", "Dairy-Free"]}
        values={dietaryPreferences}
        onChange={handleDietaryChange}
      />
      <RangeField
        label="Calories"
        minValue={caloriesMin}
        maxValue={caloriesMax}
        onMinChange={(e) => setCaloriesMin(e.target.value)}
        onMaxChange={(e) => setCaloriesMax(e.target.value)}
        idPrefix="calories"
      />
      <RangeField
        label="Protein (g)"
        minValue={proteinMin}
        maxValue={proteinMax}
        onMinChange={(e) => setProteinMin(e.target.value)}
        onMaxChange={(e) => setProteinMax(e.target.value)}
        idPrefix="protein"
      />
      <RangeField
        label="Carbs (g)"
        minValue={carbsMin}
        maxValue={carbsMax}
        onMinChange={(e) => setCarbsMin(e.target.value)}
        onMaxChange={(e) => setCarbsMax(e.target.value)}
        idPrefix="carbs"
      />
      <RangeField
        label="Fats (g)"
        minValue={fatsMin}
        maxValue={fatsMax}
        onMinChange={(e) => setFatsMin(e.target.value)}
        onMaxChange={(e) => setFatsMax(e.target.value)}
        idPrefix="fats"
      />
      <SelectField
        label="Flavor Profile"
        options={["Any", "Sweet", "Savory", "Spicy", "Sour", "Bitter", "Umami"]}
        value={flavorProfile}
        onChange={(e) => setFlavorProfile(e.target.value)}
        id="flavor-profile"
      />
      <SelectField
        label="Spice Level"
        options={["Any", "Mild", "Medium", "Hot", "Extreme"]}
        value={spiceLevel}
        onChange={(e) => setSpiceLevel(e.target.value)}
        id="spice-level"
      />
      <InputField
        label="Ingredients"
        placeholder="Enter ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        id="ingredients"
      />
      <InputField
        label="Serving Size"
        placeholder="e.g., 2 persons"
        value={servingSize}
        onChange={(e) => setServingSize(e.target.value)}
        id="serving-size"
      />
      <InputField
        label="Tags"
        placeholder="Comma-separated tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        id="tags"
      />
    </div>
  ), [
    dietaryPreferences,
    caloriesMin,
    caloriesMax,
    proteinMin,
    proteinMax,
    carbsMin,
    carbsMax,
    fatsMin,
    fatsMax,
    flavorProfile,
    spiceLevel,
    ingredients,
    servingSize,
    tags,
  ]);

  return (
    <div className="transition-all duration-300 relative">
      <div className="fixed top-20 left-3 sm:left-3 mr-3 h-[calc(100vh-6rem)]">
        <div className="bg-white dark:bg-gray-800 h-full rounded-4xl border-2 shadow-xl flex flex-col p-4 sm:p-5 overflow-hidden">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleExpand}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isExpanded ? "M15 19l-7-7 7-7" : "M9 5l-7 7 7 7"}
                />
              </svg>
            </button>
          </div>

          {isExpanded && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Healthy Search</h2>
              <div className="flex-1 overflow-y-auto pr-1 sm:pr-2">
                {renderSearchFields}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
            </>
          )}

          {isExpanded && (
            <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-2">
              <button
                onClick={applyFilters}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-lg font-medium transition"
                disabled={isLoading}
              >
                {isLoading ? "Applying..." : "Apply Filters"}
              </button>
              <button
                onClick={resetFilters}
                className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-2 px-4 rounded-lg font-medium transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CategoriesPanel.propTypes = {
  activeCategory: PropTypes.string,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  onFiltersChange: PropTypes.func,
};

export default CategoriesPanel;