import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Food models data
const models = [
  {
    id: '2',
    name: 'Burger',
    url: 'https://raw.githubusercontent.com/Akila-Wasalathilaka/openAR/main/burger.glb',
  },
  {
    id: '3',
    name: 'Pizza',
    url: 'https://raw.githubusercontent.com/Akila-Wasalathilaka/openAR/main/pizza.glb',
  },
  {
    id: '4',
    name: 'Sushi',
    url: 'https://raw.githubusercontent.com/Akila-Wasalathilaka/openAR/main/sushi.glb',
  },
  {
    id: '5',
    name: 'Taco',
    url: 'https://raw.githubusercontent.com/Akila-Wasalathilaka/openAR/main/taco.glb',
  },
  {
    id: '1',
    name: 'Cake',
    url: 'https://raw.githubusercontent.com/Akila-Wasalathilaka/openAR/main/cake.glb',
  },
];

const ARFoodPreview = () => {
  const router = useRouter();
  const { foodId } = router.query;
  const [activeModel, setActiveModel] = useState(null);

  useEffect(() => {
    if (foodId) {
      const matchedModel = models.find((model) => model.id === foodId.toLowerCase());
      if (matchedModel) {
        setActiveModel(matchedModel.url);
      }
    }
  }, [foodId]);

  if (!activeModel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <p className="text-lg font-medium text-gray-700">Loading model or invalid food ID...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <model-viewer
        src={activeModel}
        ar
        ar-modes="scene-viewer webxr"
        environment-image="neutral"
        auto-rotate
        camera-controls
        className="w-full max-w-md h-[400px] bg-white rounded-lg shadow-md"
      ></model-viewer>
    </div>
  );
};

export default ARFoodPreview;
