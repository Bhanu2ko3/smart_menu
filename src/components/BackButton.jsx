"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="relative w-12 h-12 rounded-lg backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border-gray-600 flex items-center justify-center hover:scale-105 active:scale-95 group"
      aria-label="Go Back"
    >
      {/* Back Arrow Icon */}
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
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>

      {/* Hover pulse effect */}
      <span className="absolute inset-0 rounded-full bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    </button>
  );
}
