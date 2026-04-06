import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import { HeroSection } from "./components/home/HeroSection.jsx";
import HomeLayout from "./pages/home/Homelayout.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import Login from "./pages/Auth/Login.jsx";
import TrackOrder from "./pages/Track/TrackOrder.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import Shop from "./pages/cart/Shop.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import Cart from "./pages/cart/Cart.jsx";
import Checkout from "./pages/cart/Checkout.jsx";
import ProductDetails from "./pages/product/ProductDetails.jsx";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";
import Profile from "./pages/profile/Profile.jsx";

import { useUserStore } from "./stores/useUserStore.jsx";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ⏳ While checking auth
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <LoadingSpinner
          size="md"
          label="Checking session..."
          className="text-sm text-slate-200"
          colorClass="border-cyan-300/30 border-t-cyan-300"
        />
      </div>
    );
  }

  return (
    <HomeLayout>
      <ScrollToTop />

      <Routes>
        {/* 🌐 Public */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/track/:trackingCode" element={<TrackOrder />} />

        {/* 🔓 Auth  */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" replace />}
        />

        {/* 🔐 Protected routes */}
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/cart"
          element={user ? <Cart /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/checkout"
          element={user ? <Checkout /> : <Navigate to="/login" replace />}
        />

        {/* 👑 Admin route */}
        <Route
          path="/admin"
          element={
            user && user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ❌ Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HomeLayout>
  );
}

export default App;