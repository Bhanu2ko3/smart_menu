"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ModelViewer from "@/components/ModelViewer";

const API_BASE_URL = 'https://smartmenu-backend.up.railway.app';

const ARFoodPreview = () => {
  const router = useRouter();
  const { foodId } = router.query;
  const [activeModel, setActiveModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!foodId) {
      setLoading(false);
      return;
    }

    const fetchFood = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/foods/${foodId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch food item");
        }
        const foodData = await response.json();
        if (foodData && foodData.model3DUrl) {
          setActiveModel(foodData.model3DUrl);
        } else {
          throw new Error("Food item or model not found");
        }
      } catch (err) {
        setError(err.message);
        setActiveModel(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [foodId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <p className="text-lg font-medium text-gray-700">Loading model...</p>
      </div>
    );
  }

  if (error || !activeModel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <p className="text-lg font-medium text-gray-700">
          {error || "Invalid food ID or model not found"}
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