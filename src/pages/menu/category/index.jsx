"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CategoryFoodsPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const [foods, setFoods] = useState([]);

  const allFoods = [
    { id: 1, name: "Spring Rolls", categoryId: 1 },
    { id: 2, name: "Chicken Wings", categoryId: 1 },
    { id: 3, name: "Steak", categoryId: 2 },
    { id: 4, name: "Pasta", categoryId: 2 },
    { id: 5, name: "Ice Cream", categoryId: 3 },
    { id: 6, name: "Cake", categoryId: 3 },
    { id: 7, name: "Coke", categoryId: 4 },
    { id: 8, name: "Orange Juice", categoryId: 4 },
  ];

  useEffect(() => {
    if (categoryId) {
      const filteredFoods = allFoods.filter(
        (food) => food.categoryId == categoryId
      );
      setFoods(filteredFoods);
    }
  }, [categoryId]);

  if (!categoryId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 md:pl-8 md:pr-8 md:pb-8 transition-colors duration-300">
      <header className="flex items-center mb-8">
        <h1 className="text-3xl ml-10 font-bold">
          Foods in Category {categoryId}
        </h1>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div
            key={food.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          >
            <h2 className="text-xl font-semibold">{food.name}</h2>
          </div>
        ))}
      </div>
      {foods.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No foods found for this category.
        </p>
      )}
    </div>
  );
};

export default CategoryFoodsPage;
