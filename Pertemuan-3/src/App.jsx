import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@/api/mockServer";
import "@/App.css";

// 🔹 Pages
import Login from "@/Pages/Auth/Login";
import Register from "@/Pages/Auth/Register";
import Dashboard from "@/Pages/Admin/Dashboard";
import Mahasiswa from "@/Pages/Admin/Mahasiswa";
import MahasiswaDetail from "@/Pages/Admin/MahasiswaDetail";
import MahasiswaSKS from "@/Pages/Admin/MahasiswaSKS";
import Transfer from "@/Pages/Admin/Transfer";
import DaftarTransaksi from "@/Pages/Admin/DaftarTransaksi";
import Dosen from "@/Pages/Admin/Dosen";
import MataKuliah from "@/Pages/Admin/MataKuliah";
import Users from "@/Pages/Admin/Users";
import Kelas from "@/Pages/Admin/Kelas";
import PageNotFound from "@/Pages/PageNotFound";

// 🔹 Layouts
import AuthLayout from "@/Pages/Layouts/AuthLayout";
import AdminLayout from "@/Pages/Layouts/AdminLayout";
import ProtectedRoute from "@/Pages/Layouts/ProtectedRoute";

// 🔹 Komponen utama
const App = () => {
  return <Login />;
};

const queryClient = new QueryClient();

// 🔹 Konfigurasi router
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
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
        path: "dosen",
        element: <Dosen />,
      },
      {
        path: "mata-kuliah",
        element: <MataKuliah />,
      },
      {
        path: "kelas",
        element: <Kelas />,
      },
      {
        path: "mahasiswa-sks",
        element: <MahasiswaSKS />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "transfer",
        element: <Transfer />,
      },
      {
        path: "transfer/daftartransaksi",
        element: <DaftarTransaksi />,
      },
      {
        path: "mahasiswa",
        element: <Mahasiswa />,
      },
      {
        path: "mahasiswa/:nim",
        element: <MahasiswaDetail />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

// 🔹 Render aplikasi
ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </QueryClientProvider>
  </StrictMode>
);

{/* <React.StrictMode>
  <Toaster position="top-right" />
  <RouterProvider router={router} />
</React.StrictMode> */}

export default App;
