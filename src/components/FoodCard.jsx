"use client";
import Link from "next/link";
import { useState } from "react";

const FoodCard = ({ food }) => {
  const [currency, setCurrency] = useState("USD"); // Default to USD

  // Toggle currency between USD and LKR
  const toggleCurrency = () => {
    setCurrency(currency === "USD" ? "LKR" : "USD");
  };

  // Get formatted price based on selected currency
  const getPrice = () => {
    if (!food.price) return "N/A";
    const priceValue = currency === "USD" ? food.price.USD : food.price.LKR;
    return priceValue.toFixed(2);
  };

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
        <div className="flex items-center justify-between dark:text-blue-400 font-medium mb-4 flex-shrink-0">
          <div className="flex items-center">
            <span>{currency === "USD" ? "$" : "LKR "}{getPrice()}</span>
            <button
              onClick={toggleCurrency}
              className="ml-2 text-sm text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 transition-colors duration-200"
              aria-label={`Switch to ${currency === "USD" ? "LKR" : "USD"}`}
            >
              Switch to {currency === "USD" ? "LKR" : "USD"}
            </button>
          </div>
          {/* Rating Stars */}
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index}>
                {index < Math.round(food.rating) ? "⭐" : "☆"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* View Food Button with Link to /foodOverview */}
      <Link href={`/foodOverview?foodId=${food.id}`}>
        <button className="w-full py-2 rounded-4xl border-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 mt-auto flex-shrink-0">
          View Food
        </button>
      </Link>
    </div>
  );
};

export default FoodCard;