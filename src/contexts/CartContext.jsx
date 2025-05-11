// src/contexts/CartContext.jsx
'use client';

import { createContext, useContext, useState } from 'react';

// 1. First create the context with proper typing
const CartContext = createContext({
  cartItems: [],
  cartCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
});

// 2. Create the provider component
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    setCartCount(prev => prev + 1);
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === id);
      if (itemToRemove) {
        setCartCount(prev => prev - itemToRemove.quantity);
      }
      return prevItems.filter(item => item.id !== id);
    });
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems(prevItems => {
      return prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartCount, 
        addToCart, 
        removeFromCart, 
        updateQuantity 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 3. Create the custom hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}