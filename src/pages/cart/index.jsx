"use client";

import { useCart } from "../../contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import { FaCcVisa, FaCcMastercard, FaPaypal, FaApplePay } from "react-icons/fa";
import { useState } from "react";

const API_BASE_URL = 'https://smartmenu-backend.up.railway.app';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Calculate totals using price.USD
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price.USD * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const deliveryFee = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + deliveryFee;

  // Update quantity
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity); // <-- USE CONTEXT FUNCTION
  };

  // Remove item
  const removeItem = (id) => {
    removeFromCart(id); // <-- USE CONTEXT FUNCTION
  };

  // Handle checkout
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutStatus(null);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          foodId: item.id, // Maps to _id in backend
          name: item.name,
          price: item.price.USD,
          quantity: item.quantity,
        })),
        subtotal,
        tax,
        deliveryFee,
        total,
        status: 'Pending', // Initial order status
        createdAt: new Date(),
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const savedOrder = await response.json();
      setCheckoutStatus({
        type: 'success',
        message: `Order #${savedOrder._id} placed successfully!`,
      });

      // Optionally clear cart after successful order
      // cartItems.forEach(item => removeFromCart(item.id));
    } catch (err) {
      setCheckoutStatus({
        type: 'error',
        message: err.message || 'Failed to place order. Please try again.',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 mt-13">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <Link
            href="/menu"
            className="text-primary hover:text-primary-dark flex items-center"
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

        {checkoutStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            checkoutStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {checkoutStatus.message}
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
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Your cart is empty
            </h3>
            <p className="mt-1 text-gray-500">
              Start adding some delicious items from our menu
            </p>
            <div className="mt-6">
              <Link
                href="/menu"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Browse Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-4xl overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row">
                        {/* Item Image */}
                        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                          <div className="relative h-24 w-24 rounded-md overflow-hidden">
                            <Image
                              src={item.imageUrl || "/placeholder-image.jpg"}
                              alt={item.name}
                              layout="fill"
                              objectFit="cover"
                              className="hover:opacity-90 transition-opacity"
                            />
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {item.name}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.description}
                              </p>
                              {item.dietary && (
                                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  {item.dietary}
                                </span>
                              )}
                            </div>
                            <p className="text-lg font-medium text-gray-900 ml-4">
                              ${item.price.USD.toFixed(2)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center border border-gray-300 rounded-4xl">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, item.quantity - 1)
                                }
                                className="px-3 py-1 rounded-4xl bg-red-500 hover:bg-red-600 transition"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, item.quantity + 1)
                                }
                                className="px-3 py-1 rounded-4xl bg-green-500 hover:bg-green-600 transition"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
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
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-gray-900">
                        Total
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-6">
                  <label
                    htmlFor="promo-code"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Promo Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="promo-code"
                      name="promo-code"
                      className="flex-1 block w-full rounded-l-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-2 border"
                      placeholder="Enter code"
                    />
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                      isCheckingOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                  >
                    {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                </div>

                {/* Payment Methods */}
                <div className="mt-6">
                  <h3 className="text-xs font-medium text-gray-500 mb-2">
                    WE ACCEPT
                  </h3>
                  <div className="flex space-x-4 text-3xl text-blue-500">
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

              {/* Safety Info */}
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-400 mt-0.5 mr-2"
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
                    <h3 className="text-sm font-medium text-blue-800">
                      Secure Checkout
                    </h3>
                    <p className="text-xs text-blue-700 mt-1">
                      Your payment information is processed securely. We do not
                      store your credit card details.
                    </p>
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