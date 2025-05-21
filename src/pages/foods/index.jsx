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

  useEffect(() => {
    if (!categoryId) return;

    const category = foodCategories.find((c) => c.id.toString() === categoryId);
    if (!category) {
      setCurrentCategory(null);
      setFoods([]);
      setDisplayedFoods([]);
      return;
    }

    setCurrentCategory(category);

    let filteredFoods = allFoods.filter((food) => food.categoryId == categoryId);

    if (filters) {
      // If you have filter logic, insert it here.
    }

    setFoods(filteredFoods);
    setDisplayedFoods(sortFoods(filteredFoods, sortOrder));
  }, [categoryId, filters]);

  useEffect(() => {
    if (!searchQuery) {
      setDisplayedFoods(sortFoods(foods, sortOrder));
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    let matchingFoods = foods.filter((food) =>
      food.name.toLowerCase().includes(lowerQuery)
    );

    for (let i = 0; i < matchingFoods.length; i++) {
      for (let j = 0; j < matchingFoods.length - i - 1; j++) {
        if (
          matchingFoods[j].name.toLowerCase() >
          matchingFoods[j + 1].name.toLowerCase()
        ) {
          const temp = matchingFoods[j];
          matchingFoods[j] = matchingFoods[j + 1];
          matchingFoods[j + 1] = temp;
        }
      }
    }

    setDisplayedFoods(sortFoods(matchingFoods, sortOrder));
  }, [searchQuery, foods, sortOrder]);

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



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>

        {displayedFoods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No foods found matching your search.
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              Try a different keyword or clear the search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFoodsPage;
