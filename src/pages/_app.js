import "@/styles/globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";
import BackButton from "@/components/BackButton";
import CartIcon from "@/components/CartIcon";
import { CartProvider } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import CartModal from "@/components/CartModal";
import MealBot from "@/components/MealBot";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <CartProvider>
      <div className="min-h-screen relative">
        {/* Floating transparent header */}
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <MealBot />
            <BackButton/>
          </div>
          <div className="flex items-center space-x-4 pointer-events-auto">
            <CartIcon onClick={openCart} />
          </div>
        </header>

        {/* Page content without padding/margin for header */}
        <Component {...pageProps} />

        <CartModal isOpen={isCartOpen} onClose={closeCart} />
      </div>
    </CartProvider>
  );
}
