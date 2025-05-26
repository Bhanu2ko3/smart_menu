"use client";
import { allFoods, foodCategories } from "../../data/foodData";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CategoriesPanel from "@/components/foodFilterPanel";
import FoodCard from "@/components/FoodCard";

const CategoryFoodsPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const [foods, setFoods] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    if (!categoryId) return;

    // Find current category
    const category = foodCategories.find((c) => c.id.toString() === categoryId);
    if (!category) {
      setCurrentCategory(null);
      setFoods([]);
      return;
    }
    setCurrentCategory(category);

    // Filter foods by category / applied filters
    let filteredFoods = allFoods.filter((food) => food.categoryId == categoryId);

    if (filters) {
      const { searchType, simple, medium, healthy } = filters;

      if (searchType === "simple") {
        if (simple.name) {
          filteredFoods = filteredFoods.filter((food) =>
            food.name.toLowerCase().includes(simple.name.toLowerCase())
          );
        }
        if (simple.description) {
          filteredFoods = filteredFoods.filter((food) =>
            food.description?.toLowerCase().includes(simple.description.toLowerCase())
          );
        }
      } else if (searchType === "medium") {
        if (medium.categoryName) {
          const category = foodCategories.find((c) =>
            c.name.toLowerCase().includes(medium.categoryName.toLowerCase())
          );
          if (category) {
            filteredFoods = filteredFoods.filter(
              (food) => food.categoryId == category.id
            );
          } else {
            filteredFoods = [];
          }
        }
        if (medium.price.min) {
          filteredFoods = filteredFoods.filter(
            (food) => food.price >= parseFloat(medium.price.min)
          );
        }
        if (medium.price.max) {
          filteredFoods = filteredFoods.filter(
            (food) => food.price <= parseFloat(medium.price.max)
          );
        }
        if (medium.minRating) {
          filteredFoods = filteredFoods.filter(
            (food) => food.rating >= parseFloat(medium.minRating)
          );
        }
        if (medium.origin) {
          filteredFoods = filteredFoods.filter((food) =>
            food.origin?.toLowerCase().includes(medium.origin.toLowerCase())
          );
        }
        if (medium.prepTime && medium.prepTime !== "Any Time") {
          const timeMap = {
            "Quick (under 15 min)": [0, 15],
            "Medium (15–30 min)": [15, 30],
            "Long (30+ min)": [30, Infinity],
          };
          const [min, max] = timeMap[medium.prepTime];
          filteredFoods = filteredFoods.filter(
            (food) => food.prepTime >= min && food.prepTime <= max
          );
        }
        if (medium.availability && medium.availability !== "Any") {
          filteredFoods = filteredFoods.filter(
            (food) => food.availability === medium.availability
          );
        }
      } else if (searchType === "healthy") {
        if (healthy.dietaryPreferences.length > 0) {
          filteredFoods = filteredFoods.filter((food) =>
            healthy.dietaryPreferences.every((pref) =>
              food.dietary?.includes(pref)
            )
          );
        }
        if (healthy.calories.min) {
          filteredFoods = filteredFoods.filter(
            (food) => food.calories >= parseFloat(healthy.calories.min)
          );
        }
        if (healthy.calories.max) {
          filteredFoods = filteredFoods.filter(
            (food) => food.calories <= parseFloat(healthy.calories.max)
          );
        }
        if (healthy.protein.min) {
          filteredFoods = filteredFoods.filter(
            (food) => food.protein >= parseFloat(healthy.protein.min)
          );
        }
        if (healthy.protein.max) {
          filteredFoods = filteredFoods.filter(
            (food) => food.protein <= parseFloat(healthy.protein.max)
          );
        }
        if (healthy.carbs.min) {
          filteredFoods = filteredFoods.filter(
            (food) => food.carbs >= parseFloat(healthy.carbs.min)
          );
        }
        if (healthy.carbs.max) {
          filteredFoods = filteredFoods.filter(
            (food) => food.carbs <= parseFloat(healthy.carbs.max)
          );
        }
        if (healthy.fats.min) {
          filteredFoods = filteredFoods.filter(
            (food) => food.fats >= parseFloat(healthy.fats.min)
          );
        }
        if (healthy.fats.max) {
          filteredFoods = filteredFoods.filter(
            (food) => food.fats <= parseFloat(healthy.fats.max)
          );
        }
        if (healthy.flavorProfile && healthy.flavorProfile !== "Any") {
          filteredFoods = filteredFoods.filter(
            (food) => food.flavorProfile === healthy.flavorProfile
          );
        }
        if (healthy.spiceLevel && healthy.spiceLevel !== "Any") {
          filteredFoods = filteredFoods.filter(
            (food) => food.spiceLevel === healthy.spiceLevel
          );
        }
        if (healthy.ingredients) {
          const ingredients = healthy.ingredients
            .split(",")
            .map((i) => i.trim().toLowerCase());
          filteredFoods = filteredFoods.filter((food) =>
            ingredients.every((ing) =>
              food.ingredients?.some((fi) => fi.toLowerCase().includes(ing))
            )
          );
        }
        if (healthy.servingSize) {
          filteredFoods = filteredFoods.filter(
            (food) => food.servingSize === healthy.servingSize
          );
        }
        if (healthy.tags) {
          const tags = healthy.tags.split(",").map((t) => t.trim().toLowerCase());
          filteredFoods = filteredFoods.filter((food) =>
            tags.every((tag) => food.tags?.includes(tag))
          );
        }
      }
    }

    setFoods(filteredFoods);
  }, [categoryId, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (!categoryId) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!currentCategory) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
          Invalid category selected.
        </p>
        <p className="text-gray-400 dark:text-gray-500">
          Please select a valid category.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen transition-colors duration-300">
      <CategoriesPanel
        activeCategory={categoryId}
        categories={foodCategories}
        onFiltersChange={handleFiltersChange}
      />

      <div className="flex-1 p-4 md:p-8 ml-20 ">
        <header className="flex justify-center mr-12 items-center mb-8">
          <h1 className="text-3xl font-bold">{currentCategory.name}</h1>
        </header>

        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>

        {foods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No foods found for this category.
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              Try adjusting your filters or selecting a different category. 
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFoodsPage;