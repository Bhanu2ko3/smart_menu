"use client";

import Link from "next/link";

const FoodCard = ({ food }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Image placeholder - maintains aspect ratio */}
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 relative">
        {/* This div serves as a placeholder for the image */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span>Image placeholder</span>
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-semibold mb-2">{food.name}</h2>
        {food.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {food.description}
          </p>
        )}
        {food.price && (
          <div className="text-blue-600 dark:text-blue-400 font-medium mb-3">
            ${food.price.toFixed(2)}
          </div>
        )}
      </div>
      
      <div className="px-4 pb-4">
        <Link href={`/food/${food.id}`}>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            View Food
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FoodCard;