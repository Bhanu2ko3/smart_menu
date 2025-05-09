"use client";
import { useState } from "react";

const CategoriesPanel = ({ activeCategory, categories = [] }) => {
  const [searchType, setSearchType] = useState("simple");
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const renderSearchFields = () => {
    switch (searchType) {
      case "simple":
        return (
          <div className="space-y-3 mt-4">
            <InputField label="Name" placeholder="Search by name" />
            <InputField label="Description" placeholder="Search in description" />
          </div>
        );
      case "medium":
        return (
          <div className="space-y-3 mt-4">
            <InputField label="Category" placeholder="Category name" />
            <RangeField label="Price Range" />
            <SelectField label="Minimum Rating" options={["Any", "5", "4", "3", "2"]} />
            <InputField label="Origin" placeholder="Country or region" />
            <SelectField label="Preparation Time" options={["Any Time", "Quick (under 15 min)", "Medium (15–30 min)", "Long (30+ min)"]} />
            <SelectField label="Availability" options={["Any", "In Stock", "Seasonal", "Pre-order"]} />
          </div>
        );
      case "healthy":
        return (
          <div className="space-y-3 mt-4">
            <CheckboxGroup
              label="Dietary Preferences"
              options={["Vegan", "Vegetarian", "Gluten-Free", "Keto", "Organic", "Dairy-Free"]}
            />
            <RangeField label="Calories" />
            <RangeField label="Protein (g)" />
            <RangeField label="Carbs (g)" />
            <RangeField label="Fats (g)" />
            <SelectField label="Flavor Profile" options={["Any", "Sweet", "Savory", "Spicy", "Sour", "Bitter", "Umami"]} />
            <SelectField label="Spice Level" options={["Any", "Mild", "Medium", "Hot", "Extreme"]} />
            <InputField label="Ingredients" placeholder="Enter ingredients" />
            <InputField label="Serving Size" placeholder="e.g., 2 persons" />
            <InputField label="Tags" placeholder="Comma-separated tags" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`transform transition-all duration-300 ${isExpanded ? 'w-72' : 'w-20'}`}>
      <div className="fixed h-screen overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 h-full rounded-r-3xl shadow-xl p-5 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`font-bold text-xl transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              Categories
            </h2>
            <button
              onClick={toggleExpand}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {isExpanded ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${searchType === type ? "bg-white dark:bg-gray-600 shadow-sm" : ""}`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {renderSearchFields()}

              <div className="mt-6">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Apply Filters
                </button>
                <button className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-2 px-4 rounded-lg font-medium mt-2 transition-colors">
                  Reset
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold mb-3">Browse Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <a
                      key={category.id}
                      href={`/category-foods?categoryId=${category.id}`}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        activeCategory === category.id.toString()
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {!isExpanded && (
            <div className="flex flex-col items-center space-y-4 mt-6">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/category-foods?categoryId=${category.id}`}
                  title={category.name}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                    activeCategory === category.id.toString()
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span>{category.name.charAt(0)}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable UI components
const InputField = ({ label, placeholder }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    <input type="text" className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg" placeholder={placeholder} />
  </div>
);

const RangeField = ({ label }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    <div className="flex space-x-2">
      <input type="number" className="w-1/2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg" placeholder="Min" />
      <input type="number" className="w-1/2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg" placeholder="Max" />
    </div>
  </div>
);

const SelectField = ({ label, options }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    <select className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
      {options.map((opt) => (
        <option key={opt} value={opt === "Any" ? "" : opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const CheckboxGroup = ({ label, options }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

export default CategoriesPanel;
