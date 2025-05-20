import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ModelViewer from "@/components/ModelViewer";
import { allFoods } from "../../data/foodData";

const ARFoodPreview = () => {
  const router = useRouter();
  const { foodId } = router.query;
  const [activeModel, setActiveModel] = useState(null);

  useEffect(() => {
    if (foodId) {
      const parsedId = parseInt(foodId);
      const matchedFood = allFoods.find((food) => food.id === parsedId);
      if (matchedFood) {
        setActiveModel(matchedFood.model);
      }
    }
  }, [foodId]);

  if (!activeModel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <p className="text-lg font-medium text-gray-700">
          Loading model or invalid food ID...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <ModelViewer src={activeModel} />
    </div>
  );
};

export default ARFoodPreview;
