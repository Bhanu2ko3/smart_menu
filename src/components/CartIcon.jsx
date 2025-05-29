import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";

export default function CartIcon({ onClick }) {
  const { cartItems } = useCart();
  const [itemCount, setItemCount] = useState(cartItems.length);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (cartItems.length !== itemCount) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      setItemCount(cartItems.length);
      return () => clearTimeout(timer);
    }
  }, [cartItems.length]);

  // Show nothing if cart is empty
  if (cartItems.length === 0) return null;

  return (
    <button
      onClick={onClick}
      className="relative w-12 border-orange-400 h-12 rounded-lg  backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 group"
    >
      {/* Cart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-700 dark:text-orange-500 group-hover:text-gray-300 transition-colors duration-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
        />
      </svg>

      {/* Item Count Badge */}
      <span className={`
        absolute -top-1 -right-2 bg-gradient-to-br from-orange-500 to-amber-500 
        text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center 
        shadow-md border border-white/20
        transition-all duration-300
        ${animate ? 'scale-125' : 'scale-100'}
      `}>
        {cartItems.length}
      </span>

      {/* Hover pulse effect */}
      <span className="absolute inset-0 rounded-full bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    </button>
  );
}