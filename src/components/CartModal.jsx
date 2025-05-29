"use client";

import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import { FaCcVisa, FaCcMastercard, FaPaypal, FaApplePay } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function CartModal({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [tableNumber, setTableNumber] = useState("");

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
    toast.success("Item removed from cart");
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!tableNumber) {
      toast.error("Please select your table number !");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const orderData = {
        tableNumber,
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
      toast.success("Order placed successfully!");
      clearCart();
      setTableNumber(""); // Reset table number after successful order
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

  // Generate table numbers (example: 1 to 20)
  const tableNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-orange-400"
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
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Your Order</h1>
              </div>
              <Link
                href="/menu"
                onClick={onClose}
                className="text-orange-400 hover:text-orange-300 flex items-center text-sm sm:text-base"
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

            {/* Status Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-900/30 text-green-300 rounded-lg border border-green-800/50 flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>{success}</div>
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 text-red-300 rounded-lg border border-red-800/50 flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>{error}</div>
              </div>
            )}

            {cartItems.length === 0 ? (
              /* Empty Cart State */
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-100 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-400 mb-6">
                  Start adding some delicious items from our menu
                </p>
                <Link
                  href="/menu"
                  onClick={onClose}
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50">
                    <ul className="divide-y divide-gray-700/50">
                      {cartItems.map((item) => (
                        <li
                          key={item.id}
                          className="p-4 sm:p-5 hover:bg-gray-700/20 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row gap-4">
                            {/* Item Image */}
                            <div className="flex-shrink-0 relative h-24 w-24 rounded-lg overflow-hidden border border-gray-700/50">
                              {imageErrors[item.id] ? (
                                <img
                                  src="/placeholder-food.jpg"
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Image
                                  src={item.image || "/placeholder-food.jpg"}
                                  alt={item.name}
                                  layout="fill"
                                  objectFit="cover"
                                  className="hover:opacity-90 transition-opacity"
                                  onError={() => handleImageError(item.id)}
                                />
                              )}
                            </div>

                            {/* Item Details */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold text-white">
                                    {item.name}
                                  </h3>
                                  <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                                    {item.description ||
                                      "No description available"}
                                  </p>
                                </div>
                                <p className="text-lg font-semibold text-white ml-4 whitespace-nowrap">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>

                              {/* Quantity Controls */}
                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center border border-gray-600 rounded-full">
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    className="px-3 py-1 rounded-l-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                                    disabled={item.quantity <= 1}
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 text-white min-w-[2rem] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    className="px-3 py-1 rounded-r-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-sm font-medium text-red-400 hover:text-red-300 flex items-center transition-colors"
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
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <h2 className="text-xl font-semibold mb-6">
                      Order Summary
                    </h2>

                    {/* Table Selection */}
                    <div className="mb-6">
                      <label
                        htmlFor="tableNumber"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Select Table Number
                      </label>
                      <select
                        id="tableNumber"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                        required
                      >
                        <option value="">Select a table</option>
                        {tableNumbers.map((number) => (
                          <option key={number} value={number}>
                            Table {number}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Order Total */}
                    <div className="border-t border-gray-700/50 pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-white">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/50">
                        <span className="text-lg font-semibold text-white">
                          Total
                        </span>
                        <span className="text-xl font-bold text-orange-400">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className={`w-full border mt-6 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                        loading
                          ? "bg-gray-600 cursor-not-allowed"
                          : !tableNumber
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-orange-500 hover:bg-orange-600"
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                      Payment Methods
                    </h3>
                    <div className="flex flex-wrap gap-3 text-3xl">
                      <div className="p-2 bg-blue-900/30 rounded-lg">
                        <FaCcVisa className="text-blue-400" />
                      </div>
                      <div className="p-2 bg-red-900/30 rounded-lg">
                        <FaCcMastercard className="text-red-400" />
                      </div>
                      <div className="p-2 bg-blue-800/30 rounded-lg">
                        <FaPaypal className="text-blue-300" />
                      </div>
                      <div className="p-2 bg-black/30 rounded-lg">
                        <FaApplePay className="text-gray-200" />
                      </div>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-800/30">
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h3 className="text-sm font-medium text-blue-300 mb-1">
                          Secure Checkout
                        </h3>
                        <p className="text-xs text-blue-400/80">
                          Your payment information is encrypted and processed
                          securely. We never store your credit card details.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </AnimatePresence>
  );
}
