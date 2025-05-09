"use client";
import { useState, useMemo } from "react";
import PropTypes from "prop-types";

// Reusable UI components (should be moved to separate files in production)
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
        <option key={opt} value={opt === "Any" || opt === "Any Time" ? "" : opt}>
          {opt}
        </option>
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
            checked={values[opt]}
            onChange={() => onChange(opt)}
            aria-label={opt}
          />
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const CategoriesPanel = ({ activeCategory, categories = [], onFiltersChange = () => {} }) => {
  const [searchType, setSearchType] = useState("simple");
  const [isExpanded, setIsExpanded] = useState(true);

  // Simple filters
  const [nameFilter, setNameFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");

  // Medium filters
  const [categoryNameFilter, setCategoryNameFilter] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [minRating, setMinRating] = useState("");
  const [origin, setOrigin] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [availability, setAvailability] = useState("");

  // Healthy filters
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

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleDietaryChange = (preference) => {
    setDietaryPreferences((prev) => ({
      ...prev,
      [preference]: !prev[preference],
    }));
  };

  const resetFilters = () => {
    setNameFilter("");
    setDescriptionFilter("");
    setCategoryNameFilter("");
    setPriceMin("");
    setPriceMax("");
    setMinRating("");
    setOrigin("");
    setPrepTime("");
    setAvailability("");
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
  };

  const applyFilters = () => {
    const filters = {
      searchType,
      simple: {
        name: nameFilter,
        description: descriptionFilter,
      },
      medium: {
        categoryName: categoryNameFilter,
        price: { min: priceMin, max: priceMax },
        minRating,
        origin,
        prepTime,
        availability,
      },
      healthy: {
        dietaryPreferences: Object.entries(dietaryPreferences)
          .filter(([_, value]) => value)
          .map(([key]) => key),
        calories: { min: caloriesMin, max: caloriesMax },
        protein: { min: proteinMin, max: proteinMax },
        carbs: { min: carbsMin, max: carbsMax },
        fats: { min: fatsMin, max: fatsMax },
        flavorProfile,
        spiceLevel,
        ingredients,
        servingSize,
        tags,
      },
    };
    if (typeof onFiltersChange === "function") {
      onFiltersChange(filters);
    }
  };

  const renderSearchFields = useMemo(() => {
    switch (searchType) {
      case "simple":
        return (
          <div className="space-y-3 mt-4">
            <InputField
              label="Name"
              placeholder="Search by name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              id="name-filter"
            />
            <InputField
              label="Description"
              placeholder="Search in description"
              value={descriptionFilter}
              onChange={(e) => setDescriptionFilter(e.target.value)}
              id="description-filter"
            />
          </div>
        );
      case "medium":
        return (
          <div className="space-y-3 mt-4">
            <InputField
              label="Category"
              placeholder="Category name"
              value={categoryNameFilter}
              onChange={(e) => setCategoryNameFilter(e.target.value)}
              id="category-name-filter"
            />
            <RangeField
              label="Price Range"
              minValue={priceMin}
              maxValue={priceMax}
              onMinChange={(e) => setPriceMin(e.target.value)}
              onMaxChange={(e) => setPriceMax(e.target.value)}
              idPrefix="price"
            />
            <SelectField
              label="Minimum Rating"
              options={["Any", "5", "4", "3", "2"]}
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              id="min-rating"
            />
            <InputField
              label="Origin"
              placeholder="Country or region"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              id="origin"
            />
            <SelectField
              label="Preparation Time"
              options={["Any Time", "Quick (under 15 min)", "Medium (15–30 min)", "Long (30+ min)"]}
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              id="prep-time"
            />
            <SelectField
              label="Availability"
              options={["Any", "In Stock", "Seasonal", "Pre-order"]}
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              id="availability"
            />
          </div>
        );
      case "healthy":
        return (
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
        );
      default:
        return null;
    }
  }, [
    searchType,
    nameFilter,
    descriptionFilter,
    categoryNameFilter,
    priceMin,
    priceMax,
    minRating,
    origin,
    prepTime,
    availability,
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
    <div className={`transition-all duration-300 ${isExpanded ? "w-72" : "w-20"}`}>
      <div className="fixed h-screen overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-r-3xl shadow-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`font-bold text-xl transition-opacity duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0"
              }`}
            >
              Categories
            </h2>
            <button
              onClick={toggleExpand}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
            >
              {isExpanded ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l-7 7 7 7" />
                </svg>
              )}
            </button>
          </div>

          {isExpanded && (
            <>
              <div className="mb-4">
                <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  {["simple", "medium", "healthy"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSearchType(type)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        searchType === type ? "bg-white dark:bg-gray-600 shadow-sm" : ""
                      }`}
                      aria-pressed={searchType === type}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {renderSearchFields}

              <div className="mt-6 space-y-2">
                <button
                  onClick={applyFilters}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </>
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

CategoriesPanel.defaultProps = {
  onFiltersChange: () => {},
};

export default CategoriesPanel;