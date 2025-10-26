import React from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function LoadingOverlay({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-white/30 rounded-full"></div>
          {/* Spinning ring */}
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Loading text */}
        <div className="text-white font-medium text-lg animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
}
