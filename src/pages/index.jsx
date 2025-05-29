"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMoon, FiSun, FiChevronDown, FiCheck } from "react-icons/fi";

const App = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
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
      size: "60px",
      delay: 0,
      duration: 15,
      rotate: 360,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/3075/3075977.png",
      left: "25%",
      size: "80px",
      delay: 2,
      duration: 18,
      rotate: -360,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/2718/2718224.png",
      left: "40%",
      size: "70px",
      delay: 4,
      duration: 20,
      rotate: 360,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/5787/5787096.png",
      left: "55%",
      size: "90px",
      delay: 6,
      duration: 22,
      rotate: -360,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/3142/3142039.png",
      left: "70%",
      size: "65px",
      delay: 8,
      duration: 17,
      rotate: 360,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/128/2927/2927347.png",
      left: "85%",
      size: "75px",
      delay: 10,
      duration: 19,
      rotate: -360,
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`relative font-sans min-h-screen overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Animated Food Background with Framer Motion */}
      <div className="absolute w-full h-full overflow-hidden z-0">
        {foodItems.map((item, index) => (
          <motion.img
            key={index}
            src={item.icon}
            className={`absolute opacity-60 ${
              darkMode ? "opacity-30 " : ""
            }`}
            style={{
              left: item.left,
              width: item.size,
              height: item.size,
            }}
            alt="food item"
            initial={{ y: "100vh", rotate: 0 }}
            animate={{
              y: "-100px",
              rotate: item.rotate,
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8 z-10">
        

        {/* Logo with Animation */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src="https://cdn-icons-png.flaticon.com/128/3174/3174800.png"
            className={`w-32 h-32 mx-auto mb-4 ${
              darkMode ? "invert" : ""
            } transition-all duration-500`}
            alt="Smart Menu Logo"
            whileHover={{ rotate: 10, scale: 1.1 }}
          />

          <motion.h1
            className={`text-5xl font-bold h-full  bg-clip-text ${
              darkMode
                ? "text-transparent bg-gradient-to-r from-orange-400 to-red-500"
                : "text-transparent bg-gradient-to-r from-orange-500 to-red-600"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Delights Smart Menu
          </motion.h1>
          <motion.p
            className={`text-xl mt-2 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            The future of dining experience
          </motion.p>
        </motion.div>

        {/* Start Ordering Button with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-8"
        >
          <Link href="/menu" passHref>
            <motion.button
              className={`relative overflow-hidden px-8 py-4 rounded-full text-xl font-bold shadow-lg ${
                darkMode
                  ? "bg-gradient-to-r from-orange-600 to-red-600"
                  : "bg-gradient-to-r from-orange-500 to-red-500"
              } text-white`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Start Ordering</span>
              <motion.span
                className="absolute inset-0 bg-white opacity-0 hover:opacity-10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
        </motion.div>

        {/* Language Selector with Framer Motion */}
        <motion.div
          className="relative inline-block text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.button
            id="language-menu"
            type="button"
            className={`inline-flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg shadow-sm ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-white hover:bg-gray-100"
            } border ${
              darkMode ? "border-gray-600" : "border-gray-300"
            } transition-colors duration-200`}
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <img
                src={currentLanguage.icon}
                className="w-5 h-5 mr-2"
                alt={currentLanguage.name}
              />
              <span>{currentLanguage.name}</span>
            </div>
            <FiChevronDown
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                isLanguageOpen ? "transform rotate-180" : ""
              }`}
            />
          </motion.button>

          <AnimatePresence>
            {isLanguageOpen && (
              <motion.div
                className={`absolute mt-2 w-56 rounded-lg shadow-lg z-50 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } border ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                } language-dropdown`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="py-1" role="menu">
                  {languages.map((language) => (
                    <motion.button
                      key={language.name}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm ${
                        darkMode
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                      } transition-colors duration-150`}
                      role="menuitem"
                      onClick={() => {
                        setCurrentLanguage(language);
                        setIsLanguageOpen(false);
                      }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center">
                        <img
                          src={language.icon}
                          className="w-5 h-5 mr-2"
                          alt={language.name}
                        />
                        <span>{language.name}</span>
                      </div>
                      {currentLanguage.name === language.name && (
                        <FiCheck className="w-4 h-4 text-green-500" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              darkMode ? "bg-white/10" : "bg-black/10"
            }`}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;