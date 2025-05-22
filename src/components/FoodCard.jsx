"use client";
import Link from "next/link";

const FoodCard = ({ food }) => {
  return (
    <div className="dark:bg-gray-800 p-6 rounded-4xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-[380px]">
      {/* Image Placeholder */}
      <div className="h-48 dark:bg-gray-700 rounded-4xl mb-4 flex items-center justify-center flex-shrink-0">
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

      {food.price && (
        <div className="flex items-center dark:text-blue-400 font-medium mb-4 flex-shrink-0">
          ${food.price.toFixed(2)}
          {/* Rating Stars */}
          <div className="flex text-yellow-400 ml-6">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index}>
                {index < Math.round(food.rating || 0) ? "⭐" : "☆"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* View Food Button with Link to /view */}
      <Link href={`/foodOverview?foodId=${food.id || food.name}`}>
        <button className="w-full py-2 rounded-4xl border-2 transition-colors duration-200 mt-auto flex-shrink-0">
          View Food
        </button>
      </Link>
    </div>
  );
};

export default FoodCard;