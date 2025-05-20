"use client";

import { useSearchParams } from "next/navigation";
import { allFoods } from "../../data/foodData";
import Image from "next/image";
import { useCart } from "../../contexts/CartContext";
import Link from "next/link";

export default function FoodOverview({ item }) {
  const searchParams = useSearchParams();
  const foodId = searchParams.get("foodId");
  const { addToCart } = useCart();

  if (!foodId) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const food = allFoods.find((item) => item.id.toString() === foodId);

  if (!food) {
    return (
      <div className="flex justify-center items-center h-screen">
        Food not found!
      </div>
    );
  }

  const AddToCart = () => {
    addToCart({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image || "",
      description: food.description,
    });
  };

  // Format dietary and tags if they're arrays
  const dietary = Array.isArray(food.dietary)
    ? food.dietary.join(", ")
    : food.dietary;
  const tags = Array.isArray(food.tags) ? food.tags.join(", ") : food.tags;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-13">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Food Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={food.image || ""}
              alt={food.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Food Details */}
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold ">{food.name}</h1>
            <div className="flex items-center bg-primary  px-3 py-1 rounded-full">
              <span className="text-sm font-medium">{food.rating}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>

          <p className=" mt-1">
            {food.origin} • {food.prepTime}
          </p>

          <p className=" mt-4">{food.description}</p>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-semibold text-primary">
                ${food.price.toFixed(2)}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  food.availability === "In Stock"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {food.availability}
              </span>
            </div>
            <p className="text-sm text-gray-500">{food.servingSize}</p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href={`/arFoodPreview?foodId=${food.id}`}
              className="flex-1 bg-white text-primary border border-primary py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                  clipRule="evenodd"
                />
              </svg>
              View in AR
            </Link>

            <button
              onClick={AddToCart}
              className="flex-1 bg-primary text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors duration-300 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Add to Cart
            </button>
          </div>

          {/* Detailed Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nutrition Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">
                Nutrition Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Calories</span>
                  <span className="font-medium">{food.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-medium">{food.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carbs</span>
                  <span className="font-medium">{food.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fats</span>
                  <span className="font-medium">{food.fats}g</span>
                </div>
              </div>
            </div>

            {/* Food Characteristics */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">
                Characteristics
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Flavor Profile</span>
                  <span className="font-medium capitalize">
                    {food.flavorProfile?.toLowerCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spice Level</span>
                  <span className="font-medium capitalize">
                    {food.spiceLevel?.toLowerCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dietary</span>
                  <span className="font-medium capitalize">
                    {dietary?.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">
              Ingredients
            </h3>
            <p className="text-gray-600">{food.ingredients}</p>
          </div>

          {/* Tags */}
          {food.tags && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
