"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { foodCategories, allFoods } from "../data/foodData";

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredCategories = foodCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (categoryId) => {
    router.push(`/category?categoryId=${categoryId}`);
  };

  return (
    <div className="min-h-screen p-4 md:pl-8 md:pr-8 md:pb-8 transition-colors duration-300">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-5  ">
        Our Menu
      </h1>

      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 pl-12 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 absolute left-4 top-4 text-gray-400"
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            {/* Image */}
            <img
              src={category.image || "/placeholder.png"}
              alt={category.name}
              className="w-full h-64 object-cover opacity-50"
            />

            {/* Overlay for text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <h2 className="text-2xl font-bold text-white">{category.name}</h2>
              <p className="text-white text-sm mt-2">
                {
                  allFoods.filter((food) => food.categoryId === category.id)
                    .length
                }{" "}
                items
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-4 text-lg font-medium text-gray-800 dark:text-gray-200">
            No categories found
          </h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Try adjusting your search query
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
