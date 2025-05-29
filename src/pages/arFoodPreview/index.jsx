"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FiArrowLeft, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import ModelViewer from "@/components/ModelViewer";

const API_BASE_URL = 'https://smartmenu-backend.up.railway.app';

const ARFoodPreview = () => {
  const router = useRouter();
  const { foodId } = router.query;
  const [activeModel, setActiveModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [foodName, setFoodName] = useState("");

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
        setFoodName(foodData.name || "");
      } else {
        throw new Error("3D model not available for this item");
      }
    } catch (err) {
      setError(err.message);
      setActiveModel(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!foodId) {
      setLoading(false);
      return;
    }
    fetchFood();
  }, [foodId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          variants={itemVariants}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xl font-medium text-gray-700">Loading delicious 3D model...</p>
        </motion.div>
      </motion.div>
    );
  }

  if (error || !activeModel) {
    return (
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          variants={itemVariants}
          className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center"
        >
          <div className="flex justify-center mb-4">
            <FiAlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">
            {error || "We couldn't load the 3D model for this item"}
          </p>
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
            >
              <FiArrowLeft /> Go Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchFood}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <FiRefreshCw /> Try Again
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header 
        variants={itemVariants}
        className="w-full p-4 bg-white/80 backdrop-blur-sm shadow-sm"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Menu</span>
          </motion.button>
          
          {foodName && (
            <h1 className="text-xl font-bold text-gray-800 truncate max-w-xs">
              {foodName}
            </h1>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchFood}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <FiRefreshCw className="w-5 h-5" />
            <span>Reload</span>
          </motion.button>
        </div>
      </motion.header>

      <motion.main 
        variants={itemVariants}
        className="flex-1 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-4xl">
          <ModelViewer src={activeModel} />
        </div>
      </motion.main>
    </motion.div>
  );
};

export default ARFoodPreview;