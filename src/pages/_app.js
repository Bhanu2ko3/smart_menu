import "@/styles/globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";
import BackButton from "@/components/BackButton";
import CartIcon from "@/components/CartIcon";
import { CartProvider } from "@/contexts/CartContext";
import { useState, useEffect } from "react";

export default function App({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <CartProvider>
      <BackButton />
      <CartIcon />
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Component {...pageProps} />
    </CartProvider>
  );
}