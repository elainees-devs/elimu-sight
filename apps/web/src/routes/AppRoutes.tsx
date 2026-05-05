import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages (adjust paths based on your structure)
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";


const AppRoutes: React.FC = () => {
  return (
    // public routes
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />

    {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;