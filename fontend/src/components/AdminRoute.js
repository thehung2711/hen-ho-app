import React from "react";
import { Navigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userIsAdmin = isAdmin();

  // If no token exists, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user is not admin, redirect to match page
  if (!userIsAdmin) {
    return <Navigate to="/match" replace />;
  }

  // If user is admin, render the protected component
  return children;
};

export default AdminRoute;
