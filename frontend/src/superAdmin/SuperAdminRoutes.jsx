import { Routes, Route } from "react-router-dom";

import SuperAdminLayout from "./layout/SuperAdminLayout";
import Overview from "./pages/Overview";
import Restaurants from "./pages/Restaurants";
import Approvals from "./pages/Approvals";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import OrderDetails from "./pages/orderDetails";
export default function SuperAdminRoutes() {
  return (
    <Routes>
      <Route element={<SuperAdminLayout />}>
        <Route index element={<Overview />} />
        <Route path="restaurants" element={<Restaurants />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="orders" element={<Orders />} />
        <Route path="order/:id" element={<OrderDetails />} />

        <Route path="customers" element={<Customers />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}