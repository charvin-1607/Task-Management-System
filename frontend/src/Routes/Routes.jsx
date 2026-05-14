import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Signup from "../pages/auth/Signup";
import Login from "../pages/auth/Login";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import EmployeeDashboard from "../pages/Employee/EmployeeDashboard";
import TLDashboard from "../pages/TL/TLDashboard";
import ManagerDashboard from "../pages/Manager/ManagerDashboard";

import AllTasks from "../pages/Admin/AllTasks";
import AllEmployees from "../pages/Admin/AllEmployees";

import AssignTL from "../pages/Manager/AssignTL";

import MyTeam from "../pages/TL/MyTeam";
import CreateTask from "../pages/TL/CreateTask";

import MyTasks from "../pages/Employee/MyTasks";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/Layout";
import Profile from "../pages/CommonFiles/Profile";
import ForgotPassword from "../components/Forget_&_ResetPassword/ForgotPassword";
import ResetPassword from "../components/Forget_&_ResetPassword/ResetPassword";
import ChangePassword from "../pages/CommonFiles/ChangePassword";
import LandingPage from "../pages/CommonFiles/LandingPage";







const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },


  // Admin
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Layout>
          <AdminDashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/tasks",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Layout>
          <AllTasks />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/employees",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Layout>
          <AllEmployees />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    path:"/admin/profile",
    element:(
      <ProtectedRoute allowedRoles={["admin"]}>
        <Layout>
            <Profile />
        </Layout>
      </ProtectedRoute>
    )

  },




  // Manager
  {
    path: "/manager/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["manager"]}>
        <Layout>
          <ManagerDashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/manager/assign-tl",
    element: (
      <ProtectedRoute allowedRoles={["manager"]}>
        <Layout>
          <AssignTL />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    path:"/manager/profile",
    element:(
      <ProtectedRoute allowedRoles={["manager"]}>
        <Layout>
            <Profile />
        </Layout>
      </ProtectedRoute>
    )

  },




  // TL
  {
    path: "/tl/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["tl"]}>
        <Layout>
          <TLDashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/tl/my-team",
    element: (
      <ProtectedRoute allowedRoles={["tl"]}>
        <Layout>
          <MyTeam />
        </Layout>
      </ProtectedRoute>
    ),
  },


  {
    path: "/tl/create-task",
    element: (
      <ProtectedRoute allowedRoles={["tl"]}>
        <Layout>
          <CreateTask />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    path:"/tl/profile",
    element:(
      <ProtectedRoute allowedRoles={["tl"]}>
        <Layout>
            <Profile />
        </Layout>
      </ProtectedRoute>
    )

  },


  // Employee
  {
    path: "/employee/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["employee"]}>
        <Layout>
          <EmployeeDashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/employee/my-tasks",
    element: (
      <ProtectedRoute allowedRoles={["employee"]}>
        <Layout>
          <MyTasks />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    path:"/employee/profile",
    element:(
      <ProtectedRoute allowedRoles={["employee"]}>
        <Layout>
            <Profile />
        </Layout>
      </ProtectedRoute>
    )

  },



  {
     path:"/forgot-password",
     element:<ForgotPassword />
  },

  {
    path:"/reset-password/:token",
    element:<ResetPassword />
  },

  {
    path:"/change-password",
    element:<ChangePassword />
  },

  {
    path: "*",
    element: <h2>Page Not Found</h2>,
  },
]);


function AppRoutes() {
  // RouterProvider renders page based on current URL
  return <RouterProvider router={router} />;
}

export default AppRoutes;

