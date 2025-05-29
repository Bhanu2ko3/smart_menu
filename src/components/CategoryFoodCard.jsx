import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowRight, FiStar, FiDollarSign } from "react-icons/fi";

const CategoryFoodCard = ({ food }) => {
  const router = useRouter();

  const handleFoodClick = () => {
    console.log("Navigating to foodId:", food._id);
    router.push(`/foodOverview?foodId=${food._id}`);
  };

  return (
    <motion.div
      onClick={handleFoodClick}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Image Container with Gradient Overlay */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={food.imageUrl || "/placeholder-food.jpg"}
          alt={food.name}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Floating Badges */}
        {food.isPopular && (
          <motion.div 
            className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Popular
          </motion.div>
        )}
        
        {food.isVegetarian && (
          <motion.div 
            className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            Veg
          </motion.div>
        )}
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <div className="text-white space-y-2">
          {/* Title with hover effect */}
          <motion.h3 
            className="text-lg font-bold leading-tight"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {food.name}
          </motion.h3>

          {/* Price and Rating */}
          <div className="flex items-center gap-4">
            <motion.div 
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              
              <span className="text-sm font-medium">
                <span className=" text-orange-400">LKR</span> {food.price.toFixed(2)}
              </span>
            </motion.div>

            <motion.div 
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              <FiStar className="text-orange-400" />
              <span className="text-sm font-medium text-gray-200">
                {food.rating} ★
              </span>
            </motion.div>
          </div>

          {/* Description with line clamp */}
          <motion.p 
            className="text-xs text-gray-300 line-clamp-2"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {food.description || "No description available"}
          </motion.p>
        </div>

        {/* Arrow Button (appears on hover) */}
        <motion.div
          className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2"
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiArrowRight className="w-3 h-3 text-white" />
        </motion.div>
      </div>

      {/* Floating Particles (for premium items) */}
      {food.isPremium && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-yellow-400/80"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 20 - 10],
                x: [0, Math.random() * 20 - 10],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
};

export default CategoryFoodCard;