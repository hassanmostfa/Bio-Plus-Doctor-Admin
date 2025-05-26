import React from "react";
import { Navigate } from "react-router-dom";

// A protected route component
const ProtectedRoute = ({ children }) => {
  // Check if doctor_token exists in localStorage (or check from Redux state)
  const doctor_token = localStorage.getItem('doctor_token');

  // If no doctor_token, redirect to login page
  if (!doctor_token) {
    return <Navigate to="/admin/auth/sign-in" />;
  }

  // If authenticated, render the requested page (children)
  return children;
};

export default ProtectedRoute;
