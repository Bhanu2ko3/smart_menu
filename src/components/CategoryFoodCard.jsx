import { useRouter } from "next/navigation";

const CategoryFoodCard = ({ food }) => {
  const router = useRouter();

  const handleFoodClick = () => {
    console.log("Navigating to foodId:", food._id);
    router.push(`/foodOverview?foodId=${food._id}`);
  };

  return (
    <div
      onClick={handleFoodClick}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] min-h-[200px]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={food.imageUrl || "/placeholder.png"}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
        <div className="text-white space-y-0.5">
          <h2 className="text-base sm:text-lg font-bold leading-tight group-hover:text-orange-300 transition-colors duration-200">
            {food.name}
          </h2>
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-1">
              <svg
                className="w-3 h-3 text-orange-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium text-gray-200">
                ${food.price.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <svg
                className="w-3 h-3 text-orange-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium text-gray-200">
                {food.rating} ★
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-200 line-clamp-2">
            {food.description || "No description available"}
          </p>
        </div>
        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
  );
};

export default CategoryFoodCard;