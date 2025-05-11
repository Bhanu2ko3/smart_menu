'use client';

import Link from 'next/link';
import { useCart } from '../contexts/CartContext';

export default function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Link href="/cart" className="fixed top-4 right-16 z-50 p-2 rounded-full border-2  hover:bg-gray-100 dark:hover:bg-gray-800">
      {/* Cart Icon SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6  hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>

      {/* Show badge only when cartCount > 0 */}
      <span className={`absolute -top-2 -right-2 ${cartCount > 0 ? "bg-primary" : "hidden"} text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center`}>
        {cartCount}
      </span>
    </Link>
  );
}
