"use client";

import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import { FaCcVisa, FaCcMastercard, FaPaypal, FaApplePay } from "react-icons/fa";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageErrors, setImageErrors] = useState({}); // Track which images fail to load

  // Base URL for the backend
  const BASE_URL = "https://smartmenu-backend.up.railway.app";

  // Debug cart items
  console.log("Cart items:", cartItems);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const deliveryFee = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + deliveryFee;

  // Update quantity
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  // Remove item
  const removeItem = (id) => {
    removeFromCart(id);
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const orderData = {
        tableNumber: null,
        items: cartItems.map((item) => ({
          foodId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        tax,
        deliveryFee,
        total,
      };

      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Failed to place order: ${response.statusText}`);
      }

      const result = await response.json();
      setSuccess("Order placed successfully!");
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle image load errors
  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-black/30 text-orange-400 py-8 px-4 sm:px-6 lg:px-8 mt-13">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <Link
            href="/menu"
            className="text-orange-400 hover:text-orange-500 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-100">
              Your cart is empty
            </h3>
            <p className="mt-1 text-gray-400">
              Start adding some delicious items from our menu
            </p>
            <div className="mt-6">
              <Link
                href="/menu"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Browse Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 shadow rounded-4xl overflow-hidden">
                <ul className="divide-y divide-gray-700">
                  {cartItems.map((item) => (
                    <li key={item.id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row">
                        {/* Item Image */}
                        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                          <div className="relative h-24 w-24 rounded-md overflow-hidden">
                            {imageErrors[item.id] ? (
                              <img
                                src="/placeholder.png"
                                alt={item.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <Image
                                src={item.image || "/placeholder.png"}
                                alt={item.name}
                                layout="fill"
                                objectFit="cover"
                                className="hover:opacity-90 transition-opacity"
                                onError={() => handleImageError(item.id)}
                              />
                            )}
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-100">
                                {item.name}
                              </h3>
                              <p className="mt-1 text-sm text-gray-400">
                                {item.description || "No description available"}
                              </p>
                            </div>
                            <p className="text-lg font-medium text-gray-100 ml-4">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center border border-gray-600 rounded-4xl">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="px-3 py-1 rounded-4xl bg-red-500 hover:bg-red-600 transition"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-gray-100">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="px-3 py-1 rounded-4xl bg-green-500 hover:bg-green-600 transition"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-red-500 text-sm font-medium flex items-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-gray-800 shadow rounded-lg p-6">
                <div className="space-y-4">
                  <div className="border-t border-gray-600 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-gray-100">
                        Total
                      </span>
                      <span className="text-lg font-bold text-gray-100">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={loading}
                    className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                      loading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                  >
                    {loading ? "Processing..." : "Order Now"}
                  </button>
                </div>

                {/* Payment Methods */}
                <div className="mt-6">
                  <h3 className="text-xs font-medium text-gray-400 mb-2">
                    WE ACCEPT
                  </h3>
                  <div className="flex space-x-4 text-3xl text-blue-400">
                    <div className="flex-shrink-0">
                      <FaCcVisa />
                    </div>
                    <div className="flex-shrink-0">
                      <FaCcMastercard />
                    </div>
                    <div className="flex-shrink-0">
                      <FaPaypal />
                    </div>
                    <div className="flex-shrink-0">
                      <FaApplePay />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
