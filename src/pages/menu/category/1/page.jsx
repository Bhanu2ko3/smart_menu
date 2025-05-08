'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

// Mock data - replace with your actual data source
const categoryFoods = {
  1: [
    { id: 101, name: 'Bruschetta', price: 8.99, description: 'Toasted bread topped with tomatoes, garlic, and fresh basil', image: 'https://cdn-icons-png.flaticon.com/512/3174/3174060.png' },
    { id: 102, name: 'Spring Rolls', price: 7.50, description: 'Crispy rolls with vegetables and dipping sauce', image: 'https://cdn-icons-png.flaticon.com/512/3174/3174060.png' },
  ],
  2: [
    { id: 201, name: 'Grilled Salmon', price: 18.99, description: 'Fresh salmon with lemon butter sauce', image: 'https://cdn-icons-png.flaticon.com/512/3174/3174155.png' },
    { id: 202, name: 'Beef Steak', price: 22.50, description: 'Premium cut with roasted vegetables', image: 'https://cdn-icons-png.flaticon.com/512/3174/3174155.png' },
  ],
  // Add more categories as needed
};

const categoryNames = {
  1: 'Appetizers',
  2: 'Main Courses',
  // Add more category names
};

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId;
  const foods = categoryFoods[categoryId] || [];
  const categoryName = categoryNames[categoryId] || 'Category';

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      {/* Header with back button and title */}
      <header className="flex items-center mb-8">
        <Link
          href="/menu"
          className="p-2 rounded-full bg-white shadow mr-4 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold">{categoryName}</h1>
      </header>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div
            key={food.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-16 h-16 object-contain mr-4 dark:invert"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {food.name}
                  </h2>
                  <p className="text-orange-500 font-medium">
                    ${food.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {food.description}
              </p>
              <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300">
                Add to Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {foods.length === 0 && (
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
            No items found in this category
          </h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Please check back later
          </p>
        </div>
      )}
    </div>
  );
}