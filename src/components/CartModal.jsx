"use client";

import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import { FaCcVisa, FaCcMastercard, FaPaypal, FaApplePay } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const cartItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  exit: { opacity: 0, x: 20 }
};

const summaryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 200
    }
  }
};

export default function CartModal({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [tableNumber, setTableNumber] = useState("");

  const BASE_URL = "https://smartmenu-backend.up.railway.app";

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const removeItem = (id) => {
    removeFromCart(id);
    toast.success("Item removed from cart");
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!tableNumber) {
      toast.error("Please select your table number!");
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
      setTableNumber("");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const tableNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-[1000] p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
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
          </motion.button>

          <div className="p-6 lg:p-8">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  animate={{
                    rotate: [0, 5, -5, 0],
                    transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                  }}
                  className="p-2 bg-orange-500/20 rounded-lg"
                >
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
                </motion.div>
                <h1 className="text-2xl sm:text-3xl font-bold">Your Order</h1>
              </div>
              <motion.div whileHover={{ x: 3 }}>
                <Link
                  href="/menu"
                  onClick={onClose}
                  className="text-orange-400 sm:mt-7 hover:text-orange-300 flex items-center text-sm sm:text-base"
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
              </motion.div>
            </motion.div>

            {cartItems.length === 0 ? (
              /* Empty Cart State */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    transition: { repeat: Infinity, duration: 3 }
                  }}
                  className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6"
                >
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
                </motion.div>
                <h3 className="text-xl font-medium text-gray-100 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-400 mb-6">
                  Start adding some delicious items from our menu
                </p>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/menu"
                    onClick={onClose}
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
                  >
                    Browse Menu
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                    className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50"
                  >
                    <ul className="divide-y divide-gray-700/50">
                      <AnimatePresence>
                        {cartItems.map((item) => (
                          <motion.li
                            key={item.id}
                            variants={cartItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            className="p-4 sm:p-5 hover:bg-gray-700/20 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row gap-4">
                              {/* Item Image */}
                              <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="flex-shrink-0 relative h-24 w-24 rounded-lg overflow-hidden border border-gray-700/50"
                              >
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
                              </motion.div>

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
                                    LKR {(item.price).toFixed(2)}
                                  </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="mt-4 flex items-center justify-between">
                                  <div className="flex items-center border border-gray-600 rounded-full">
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
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
                                    </motion.button>
                                    <span className="px-3 py-1 text-orange-400 min-w-[2rem] text-center">
                                      {item.quantity}
                                    </span>
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity + 1
                                        )
                                      }
                                      className="px-3 py-1 rounded-r-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                                    >
                                      +
                                    </motion.button>
                                  </div>

                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
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
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </motion.div>
                </div>

                {/* Order Summary */}
                <motion.div 
                  variants={summaryVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
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
                      <motion.select
                        whileFocus={{ scale: 1.01 }}
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
                      </motion.select>
                    </div>

                    {/* Order Total */}
                    <div className="border-t border-gray-700/50 pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-white">
                          {subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/50">
                        <span className="text-lg font-semibold text-white">
                          Total
                        </span>
                        <motion.span 
                          animate={{
                            scale: [1, 1.05, 1],
                            transition: { repeat: Infinity, duration: 2 }
                          }}
                          className="text-xl font-bold text-orange-400"
                        >
                          LKR {total.toFixed(2)}
                        </motion.span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <motion.button
                      whileHover={!loading && tableNumber ? { scale: 1.02 } : {}}
                      whileTap={!loading && tableNumber ? { scale: 0.98 } : {}}
                      onClick={handleCheckout}
                      disabled={loading || !tableNumber}
                      className={`flex-1 flex items-center justify-center gap-3 w-full font-medium mt-6 px-6 py-3 rounded-lg ${
                        loading
                          ? "bg-gray-600 cursor-not-allowed"
                          : !tableNumber
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-orange-500 hover:bg-orange-600"
                      }`}
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : null}
                      {loading ? "Processing..." : "Place Order"}
                    </motion.button>
                  </div>

                  {/* Payment Methods */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                  >
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                      Payment Methods
                    </h3>
                    <div className="flex flex-wrap gap-3 text-3xl">
                      <motion.div 
                        whileHover={{ y: -3 }}
                        className="p-2 bg-blue-900/30 rounded-lg"
                      >
                        <FaCcVisa className="text-blue-400" />
                      </motion.div>
                      <motion.div 
                        whileHover={{ y: -3 }}
                        className="p-2 bg-red-900/30 rounded-lg"
                      >
                        <FaCcMastercard className="text-red-400" />
                      </motion.div>
                      <motion.div 
                        whileHover={{ y: -3 }}
                        className="p-2 bg-blue-800/30 rounded-lg"
                      >
                        <FaPaypal className="text-blue-300" />
                      </motion.div>
                      <motion.div 
                        whileHover={{ y: -3 }}
                        className="p-2 bg-black/30 rounded-lg"
                      >
                        <FaApplePay className="text-gray-200" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Security Info */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="bg-blue-900/20 rounded-xl p-4 border border-blue-800/30"
                  >
                    <div className="flex">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          transition: { repeat: Infinity, duration: 4 }
                        }}
                      >
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
                      </motion.div>
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
                  </motion.div>
                </motion.div>
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
          theme="dark"
        />
      </motion.div>
    </AnimatePresence>
  );
}