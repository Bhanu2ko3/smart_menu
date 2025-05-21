import React from "react";

const SortByPrice = ({ sortOrder, onChange }) => {
  return (
    <div className="mb-6 w-full max-w-3xl">
      <label htmlFor="sortPrice" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
        Sort by:
      </label>
      <select
        id="sortPrice"
        value={sortOrder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        <option value="">None</option>
        <option value="high-to-low">High to Low</option>
        <option value="low-to-high">Low to High</option>
      </select>
    </div>
  );
};

export default SortByPrice;
