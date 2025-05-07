import { useParams, useNavigate } from 'react-router-dom';

const CategoryDetails = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  // In a real app, you would fetch this data based on categoryId
  const category = {
    id: categoryId,
    name: ['Appetizers', 'Main Courses', 'Desserts', 'Drinks', 'Specials', 'Vegetarian'][categoryId - 1],
    items: [
      { id: 1, name: 'Item 1', price: '$9.99', description: 'Description of item 1' },
      { id: 2, name: 'Item 2', price: '$12.99', description: 'Description of item 2' },
      // More items...
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
      <header className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/menu')}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow mr-4 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{category.name}</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.items.map(item => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{item.name}</h3>
            <p className="text-orange-500 font-medium mb-3">{item.price}</p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
              Add to Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDetails;