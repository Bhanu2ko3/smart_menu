"use client";
import { useState } from "react";

const CategoriesPanel = ({ activeCategory }) => {
  const [searchType, setSearchType] = useState("simple");
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderSearchFields = () => {
    switch (searchType) {
      case "simple":
        return (
          <div className="space-y-3 mt-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                placeholder="Search by name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                placeholder="Search in description"
              />
            </div>
          </div>
        );
      case "medium":
        return (
          <div className="space-y-3 mt-4">
            {/* Medium fields here (unchanged) */}
          </div>
        );
      case "healthy":
        return (
          <div className="space-y-3 mt-4">
            {/* Healthy fields here (unchanged) */}
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>

          {isExpanded && (
            <div className="mb-6">
              <div className="mb-4">
                <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${searchType === "simple" ? "bg-white dark:bg-gray-600 shadow-sm" : ""}`}
                    onClick={() => setSearchType("simple")}
                  >
                    Simple
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${searchType === "medium" ? "bg-white dark:bg-gray-600 shadow-sm" : ""}`}
                    onClick={() => setSearchType("medium")}
                  >
                    Medium
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${searchType === "healthy" ? "bg-white dark:bg-gray-600 shadow-sm" : ""}`}
                    onClick={() => setSearchType("healthy")}
                  >
                    Healthy
                  </button>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPanel;
