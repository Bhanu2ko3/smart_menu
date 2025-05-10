"use client";
import Link from "next/link";

const FoodCard = ({ food }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-[450px]">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center flex-shrink-0">
        {food.image ? (
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-400 dark:text-gray-500">No Image</span>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2 flex-shrink-0">{food.name}</h2>
      {food.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-4 flex-grow overflow-auto">
          {food.description}
        </p>
      )}
      {food.price && (
        <div className="text-blue-600 dark:text-blue-400 font-medium mb-4 flex-shrink-0">
          ${food.price.toFixed(2)}
        </div>
      )}

      {/* View Food Button with Link to /view */}
      <Link href={`/view?foodId=${food.id}`}>
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 mt-auto flex-shrink-0">
          View Food
        </button>
      </Link>
    </div>
  );
};

export default FoodCard;