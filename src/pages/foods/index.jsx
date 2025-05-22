"use client";
import { allFoods, foodCategories } from "../../data/foodData";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CategoriesPanel from "@/components/foodFilterPanel";
import FoodCard from "@/components/FoodCard";
import SortByPrice from "@/components/SortByPrice";

const CategoryFoodsPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const [foods, setFoods] = useState([]);
  const [displayedFoods, setDisplayedFoods] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [filters, setFilters] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) {
      setCurrentCategory(null);
      setFoods(allFoods);
      setDisplayedFoods(sortFoods(allFoods, sortOrder));
      return;
    }

    const category = foodCategories.find((c) => c.id.toString() === categoryId);
    if (!category) {
      setCurrentCategory(null);
      setFoods([]);
      setDisplayedFoods([]);
      return;
    }

    setCurrentCategory(category);
    setFoods(allFoods.filter((food) => food.categoryId.toString() === categoryId));
    setDisplayedFoods(sortFoods(foods, sortOrder));
  }, [categoryId]);

  useEffect(() => {
    if (!searchQuery && (!filters || !filters.healthy || !filters.healthy.recommendations)) {
      setDisplayedFoods(sortFoods(foods, sortOrder));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let filteredFoods = [...foods];

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filteredFoods = filteredFoods.filter((food) =>
          food.name.toLowerCase().includes(lowerQuery)
        );
      }

      if (filters && filters.healthy && filters.healthy.recommendations) {
        filteredFoods = filters.healthy.recommendations;
      } else if (filters && filters.healthy) {
        filteredFoods = [];
        throw new Error("No foods match your preferences. Try adjusting your filters.");
      }

      setDisplayedFoods(sortFoods(filteredFoods, sortOrder));
    } catch (err) {
      console.error('Filter error:', err);
      setError(err.message);
      setDisplayedFoods([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filters, sortOrder, foods]);

  const sortFoods = (foodArray, order) => {
    if (!order) return foodArray;

    const sorted = [...foodArray];
    if (order === "high-to-low") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (order === "low-to-high") {
      sorted.sort((a, b) => a.price - b.price);
    }
    return sorted;
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  if (!categoryId) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!currentCategory) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
          Invalid category selected.
        </p>
        <p className="text-gray-400 dark:text-gray-500">
          Please select a valid category.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen transition-colors duration-300">
      <CategoriesPanel
        activeCategory={categoryId}
        categories={foodCategories}
        onFiltersChange={handleFiltersChange}
      />

      <div className="flex-1 p-4 md:p-8 ml-20">
        <header className="mb-8 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">{currentCategory.name}</h1>

          <div className="flex flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Search food by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-grow px-5 py-3 rounded-3xl shadow-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            <div className="w-40">
              <SortByPrice sortOrder={sortOrder} onChange={handleSortChange} />
            </div>
          </div>
        </header>

        {isLoading && <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>

        {displayedFoods.length === 0 && !isLoading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No foods found matching your search or filters.
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              Try adjusting your preferences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFoodsPage;