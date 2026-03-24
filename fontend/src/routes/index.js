import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "../pages";
import { Login, Register, RegisterInfo, Match } from "../features";
import ForgotPassword from "../features/auth/ForgotPassword";
import Settings from "../pages/Settings/Settings";
import Profile from "../pages/Profile/Profile";
import Layout from "../layouts/Layout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import Users from "../pages/Admin/Users/Users";
import Interests from "../pages/Admin/Interests/Interests";

export const router = createBrowserRouter([
  // Profile route without layout (no header/footer)
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  // Admin routes with admin layout
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "interests",
        element: <Interests />,
      },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "match",
        element: (
          <ProtectedRoute>
            <Match />
          </ProtectedRoute>
        ),
      },
      {
        path: "register-info",
        element: (
          <ProtectedRoute>
            <RegisterInfo />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },

      {
        path: "*",
        element: (
          <ProtectedRoute>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <h2>404 - Page Not Found</h2>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
