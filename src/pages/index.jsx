"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const App = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({
    name: "English",
    icon: "https://cdn-icons-png.flaticon.com/128/330/330425.png",
  });

  const languages = [
    {
      name: "English",
      icon: "https://cdn-icons-png.flaticon.com/128/330/330425.png",
    },
    {
      name: "Español",
      icon: "https://cdn-icons-png.flaticon.com/128/330/330477.png",
    },
    {
      name: "Français",
      icon: "https://cdn-icons-png.flaticon.com/128/330/330459.png",
    },
    {
      name: "日本語",
      icon: "https://cdn-icons-png.flaticon.com/128/197/197604.png",
    },
  ];

  const foodItems = [
    {
      icon: "https://cdn-icons-png.flaticon.com/128/5787/5787100.png",
      left: "10%",
      width: "60px",
      delay: "0s",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/3075/3075977.png",
      left: "25%",
      width: "80px",
      delay: "2s",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/2718/2718224.png",
      left: "40%",
      width: "70px",
      delay: "4s",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/5787/5787096.png",
      left: "55%",
      width: "90px",
      delay: "6s",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/3142/3142039.png",
      left: "70%",
      width: "65px",
      delay: "8s",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/2927/2927347.png",
      left: "85%",
      width: "75px",
      delay: "10s",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest("#language-menu") &&
        !event.target.closest(".language-dropdown")
      ) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative font-sans min-h-screen overflow-hidden transition-colors duration-300`}
    >
      {/* Animated Food Background */}
      <div className="absolute w-full h-full overflow-hidden z-0">
        {foodItems.map((item, index) => (
          <img
            key={index}
            src={item.icon}
            className="absolute opacity-60 dark:opacity-30 animate-float"
            style={{
              left: item.left,
              width: item.width,
              animationDelay: item.delay,
              animationDuration: "15s",
            }}
            alt="food item"
          />
        ))}
      </div>

   {/* Main Content Container */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8 z-10">
        {/* Logo */}
        <div className="mb-12 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/128/3174/3174800.png"
            className={`w-32 h-32 mx-auto mb-4 ${darkMode ? 'invert' : ''}`}
            alt="Smart Menu Logo"
          />

          <h1 className={`text-5xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-black'
          }`}>
            Smart Menu
          </h1>
          <p className={`text-xl ${
            darkMode ? 'text-slate-300' : 'text-black'
          }`}>
            The future of dining experience
          </p>
        </div>

        {/* Start Ordering Button */}
        <Link
          href="/menu"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 dark:from-orange-600 dark:to-red-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform transition hover:scale-105 mb-8"
        >
          Start Ordering
        </Link>

        {/* Language Selector */}
        <div className="relative inline-block text-left">
          <div>
            <button
              id="language-menu"
              type="button"
              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium  bg-white  border border-gray-300  rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            >
              <img
                src={currentLanguage.icon}
                className="w-5 h-5 mr-2"
                alt={currentLanguage.name}
              />
              {currentLanguage.name}
              <svg
                className="w-5 h-5 ml-2 -mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {isLanguageOpen && (
            <div className="absolute mt-2 w-56 rounded-md shadow-lg  ring-1 ring-gray-500 language-dropdown">
              <div className="p-1" role="menu">
                {languages.map((language) => (
                  <button
                    key={language.name}
                    className="block w-full text-left px-4 py-2 text-sm "
                    role="menuitem"
                    onClick={() => {
                      setCurrentLanguage(language);
                      setIsLanguageOpen(false);
                    }}
                  >
                    <img
                      src={language.icon}
                      className="w-5 h-5 inline mr-2"
                      alt={language.name}
                    />
                    {language.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
