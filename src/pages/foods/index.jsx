"use client";
import { allFoods, foodCategories } from "../../data/foodData";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FoodCard from "@/components/FoodCard";

const CategoryFoodsPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const [foods, setFoods] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    if (!categoryId) return;

    // Find current category
    const category = foodCategories.find((c) => c.id.toString() === categoryId);
    if (!category) {
      setCurrentCategory(null);
      setFoods([]);
      return;
    }
    setCurrentCategory(category);

    // Fetch foods by category
    const filteredFoods = allFoods.filter((food) => food.categoryId == categoryId);
    setFoods(filteredFoods);
  }, [categoryId]);

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
      <div className="flex-1 p-4 md:p-8 ml-20">
        <header className="flex justify-center mr-12 items-center mb-8">
          <h1 className="text-3xl font-bold">{currentCategory.name}</h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>

        {foods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No foods found for this category.
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              Try selecting a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFoodsPage;