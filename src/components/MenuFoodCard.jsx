import { useRouter } from "next/navigation";

const MenuFoodCard = ({ category, foods }) => {
  const router = useRouter();

  const handleCategoryClick = () => {
    console.log("Navigating to category:", category.name);
    router.push(`/foods?category=${encodeURIComponent(category.name)}`);
  };

  return (
    <div
      onClick={handleCategoryClick}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 active:translate-y-0 min-h-[220px]"
    >
      {/* Category Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => (e.target.src = "/placeholder-food.jpg")}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      </div>

      {/* Category Info */}
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors duration-200">
            {category.name}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-100">
              {foods.filter((food) => food.category === category.name).length} items
            </span>
            <span className="text-xs font-medium text-gray-300">
              View all →
            </span>
          </div>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-10 h-10 bg-orange-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MenuFoodCard;