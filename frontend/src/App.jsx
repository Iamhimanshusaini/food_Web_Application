
import { Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader"
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Login from "./pages/Login";
import Forgot from "./pages/forrgotPassword";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import VerifyOTP from "./pages/VerifyOTP";
import AdminDashboard from "./restaurantAdmin/AdminDashboard";
import CreateRestaurant from "./restaurantAdmin/CreateRestaurant";
import SuperAdminRoutes from "./superAdmin/SuperAdminRoutes";
import { useState, useEffect } from "react";
// Navbar and Footer sirf customer pages par dikhenge
function UserLayout() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <Routes>
      {/* Customer website layout */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/restaurants" element={<Restaurants />} />
        <Route
          path="/restaurant/:id"
          element={<RestaurantDetails />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />

        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />

        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route
          path="/create-restaurant"
          element={<CreateRestaurant />}
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Restaurant admin: no customer Navbar or Footer */}
      <Route
        path="/rs-admin"
        element={<AdminDashboard />}
      />
      <Route
          path="/super-admin/*"
          element={<SuperAdminRoutes />}
        />
    </Routes>

  );
}
