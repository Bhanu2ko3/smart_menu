import { useState, useEffect } from 'react';
import { allFoods, foodCategories } from "../data/foodData";

/**
 * Custom hook for filtering food items based on category and applied filters
 * @param {string} categoryId - The ID of the selected category
 * @param {object} filters - The filter criteria to apply
 * @returns {object} The filtered foods and current category
 */
const useFoodFiltering = (categoryId, filters) => {
  const [foods, setFoods] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

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

  return { foods, currentCategory };
};

export default useFoodFiltering;