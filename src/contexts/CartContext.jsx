"use client";

import { createContext, useContext, useState, useEffect } from "react";

// 1. Create context with default values
const CartContext = createContext({
  cartItems: [],
  cartCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
});

export function CartProvider({ children }) {
  // Initialize with default values to avoid server-side issues
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart items and count from localStorage after mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    const savedCount = localStorage.getItem("cartCount");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedCount) {
      setCartCount(parseInt(savedCount, 10));
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save cart items and count to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("cartCount", cartCount.toString());
  }, [cartItems, cartCount]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    setCartCount((prev) => prev + 1); // Increment count for new item
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id);
      if (itemToRemove) {
        setCartCount((prev) => prev - itemToRemove.quantity);
      }
      return prevItems.filter((item) => item.id !== id);
    });
  };

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      // Recalculate cartCount based on updated quantities
      const newCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(newCount);
      return updatedItems;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}