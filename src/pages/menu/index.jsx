"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/BackButton";

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const foodCategories = [
    {
      id: 1,
      name: "Appetizers",
      image: "",
      items: 12,
    },
    {
      id: 2,
      name: "Main Courses",
      image: "",
      items: 20,
    },
    {
      id: 3,
      name: "Desserts",
      image: "",
      items: 15,
    },
    {
      id: 4,
      name: "Beverages",
      image: "",
      items: 18,
    },
    {
      id: 5,
      name: "Salads",
      image: "",
      items: 10,
    },
    {
      id: 6,
      name: "Snacks",
      image: "",
      items: 8,
    },
    {
      id: 7,
      name: "Drinks",
      image: "",
      items: 8,
    },
  ];

  const filteredCategories = foodCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle category click (alternative to using Link)
  const handleCategoryClick = (categoryId) => {
    router.push(`/menu/category/${categoryId}`);
  };

  return (
    <div className="min-h-screen p-4  md:pl-8 md:pr-8 md:pb-8 transition-colors duration-300">
      {/* Header with back button and title */}
      <header className="flex items-center mb-8">
        
        <h1 className="text-3xl ml-10 font-bold">Our Menu</h1>
      </header>

      {/* Search Bar */}
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-16 h-16 object-contain mr-4 dark:invert"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {category.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {category.items} items
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
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
