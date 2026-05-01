// src/pages/NotFound.tsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>

      <p className="mt-4 text-xl text-gray-600">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <p className="mt-2 text-gray-500">
        It might have been moved or deleted.
      </p>

      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;