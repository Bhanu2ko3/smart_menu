"use client";
import { allFoods, foodCategories } from "../../data/foodData";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CategoriesPanel from "@/components/CategoriesPanel";

const CategoryFoodsPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const [foods, setFoods] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    if (categoryId) {
      const filteredFoods = allFoods.filter(
        (food) => food.categoryId == categoryId
      );
      setFoods(filteredFoods);
      
      // Find current category name
      const category = foodCategories.find(c => c.id.toString() === categoryId);
      setCurrentCategory(category);
    }
  }, [categoryId]);

  if (!categoryId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen transition-colors duration-300">
      <CategoriesPanel activeCategory={categoryId} />
      
      <div className="flex-1 p-4 md:p-8 ml-20 sm:ml-72">
        <header className="flex items-center mb-8">
          <h1 className="text-3xl font-bold">
            {currentCategory ? currentCategory.name : `Category ${categoryId}`}
          </h1>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{food.name}</h2>
              {food.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {food.description}
                </p>
              )}
              {food.price && (
                <div className="text-blue-600 dark:text-blue-400 font-medium">
                  ${food.price.toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {foods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No foods found for this category.
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              Try adjusting your filters or selecting a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFoodsPage;