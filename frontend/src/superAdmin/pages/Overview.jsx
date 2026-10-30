import { useNavigate } from "react-router-dom";
import {
  Store,
  Clock,
  ShoppingBag,
  IndianRupee,
  ClipboardList,
  ArrowUpRight,
  Utensils,
} from "lucide-react";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import API from "../../api/api";

import PageHeading from "../components/PageHeading";
import StatCard from "../components/StatCard";
import RestaurantTable from "../components/RestaurantTable";
import RestaurantDetailsModal from "../components/RestaurantDetailsModal";
import Toast from "../components/Toast";

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

export default function Overview() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);

  const [selected, setSelected] = useState(null);
  const [notification, setNotification] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ================= FETCH DASHBOARD DATA =================

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [restaurantResponse, orderResponse] = await Promise.all([
        axios.get(`${API}/super-admin/restaurants`, { headers }),
        axios.get(`${API}/super-admin/orders`, { headers }),
      ]);

      // Restaurant data
      const restaurantData = restaurantResponse.data.restaurants || [];

      const formattedRestaurants = restaurantData.map((restaurant) => ({
        ...restaurant,
        status:
          restaurant.approvalStatus === "rejected"
            ? "Rejected"
            : restaurant.isApproved === true
              ? "Approved"
              : "Pending",
      }));

      setRestaurants(formattedRestaurants);

      // Orders data
      const orderData = orderResponse.data.orders || [];

      setOrders(orderData);
    } catch (err) {
      console.error("Dashboard API Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ================= DASHBOARD STATISTICS =================

  const pending = restaurants.filter(
    (restaurant) => restaurant.status === "Pending"
  ).length;

  const totalOrders = orders.length;

  // Revenue from delivered orders only
  const totalRevenue = orders
    .filter(
      (order) => order.orderStatus?.toLowerCase() === "delivered"
    )
    .reduce((total, order) => {
      const amount =
        order.totalAmount ??
        (
          Number(order.subtotal || 0) +
          Number(order.deliveryCharge || 0) +
          Number(order.tax || 0) -
          Number(order.discount || 0)
        );

      return total + Number(amount);
    }, 0);

  // ================= APPROVE / REJECT RESTAURANT =================

  const update = async (id, status) => {
    try {
      const isApproved = status.toLowerCase() === "approved";

      const response = await axios.put(
        `${API}/super-admin/restaurants/${id}/approve`,
        {
          isApproved,
          ...(!isApproved
            ? { rejectionReason: "Rejected by Super Admin" }
            : {}),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedRestaurant = response.data.restaurant;

      setRestaurants((previous) =>
        previous.map((restaurant) =>
          restaurant._id === id
            ? {
                ...restaurant,
                ...updatedRestaurant,
                status: isApproved ? "Approved" : "Rejected",
              }
            : restaurant
        )
      );

      setSelected(null);

      setNotification(
        response.data.message || `Restaurant ${status.toLowerCase()} successfully.`
      );

      if (response.data.emailSent === false) {
        setNotification(
          "Restaurant status updated, but notification email could not be sent."
        );
      }
    } catch (err) {
      console.error("Restaurant update error:", err);

      setNotification(
        err.response?.data?.message || "Unable to update restaurant status."
      );
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p className="mt-3 text-sm text-slate-500">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeading
        title="Here's your business overview"
        description="Welcome back, Admin. Here's what's happening with your food delivery platform."
        action={
          <button
            onClick={() => navigate("/super-admin/approvals")}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-100 hover:bg-orange-600"
          >
            <ClipboardList size={17} />
            Review applications
            {pending > 0 && (
              <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-xs">
                {pending}
              </span>
            )}
          </button>
        }
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
          <button
            onClick={fetchDashboardData}
            className="ml-3 font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total restaurants"
          value={String(restaurants.length).padStart(2, "0")}
          change="Live data"
          icon={Store}
        />

        <StatCard
          title="Pending approvals"
          value={String(pending).padStart(2, "0")}
          change={`${pending} awaiting`}
          positive={pending === 0}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
        />

        <StatCard
          title="Total orders"
          value={totalOrders.toLocaleString("en-IN")}
          change="Live data"
          icon={ShoppingBag}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        />

        <StatCard
          title="Total revenue"
          value={money(totalRevenue)}
          change="Delivered orders"
          icon={IndianRupee}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
        />
      </div>

      {/* BANNER */}

      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-orange-200">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            Your platform at a glance
          </span>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            Great food brings
            <br />
            people together.
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            Review new restaurant applications, monitor performance,
            and help customers discover their next favourite meal.
          </p>

          <button
            onClick={() => navigate("/super-admin/restaurants")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold hover:bg-orange-400"
          >
            Explore restaurants
            <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border-[40px] border-white/5" />

        <div className="pointer-events-none absolute -bottom-36 right-28 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

        <Utensils className="pointer-events-none absolute bottom-7 right-10 hidden h-32 w-32 rotate-12 text-white/10 sm:block" />
      </div>

      {/* RESTAURANTS */}

      <RestaurantTable
        restaurants={restaurants}
        onStatusChange={update}
        onView={setSelected}
      />

      {/* RECENT ORDERS */}

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent orders
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest orders across Foodly
            </p>
          </div>

          <button
            onClick={() => navigate("/super-admin/orders")}
            className="text-sm font-semibold text-orange-600"
          >
            View all <ArrowUpRight className="inline" size={15} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400">
                <th className="py-3">Order ID</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Restaurant</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {orders.slice(0, 4).map((order) => {
                const customer =
                  order.customer?.name ||
                  order.customerName ||
                  order.customer?.email ||
                  "Customer";

                const restaurant =
                  order.items?.[0]?.restaurantName ||
                  order.restaurantName ||
                  "Restaurant";

                const amount =
                  order.totalAmount ??
                  (
                    Number(order.subtotal || 0) +
                    Number(order.deliveryCharge || 0) +
                    Number(order.tax || 0) -
                    Number(order.discount || 0)
                  );

                return (
                  <tr key={order._id}>
                    <td className="py-4 text-sm font-bold text-orange-600">
                      #{order.orderId || order._id}
                    </td>

                    <td className="py-4 text-sm">{customer}</td>

                    <td className="py-4 text-sm">{restaurant}</td>

                    <td className="py-4 text-sm font-semibold">
                      {money(amount)}
                    </td>

                    <td className="py-4 text-sm capitalize">
                      {order.orderStatus || "Pending"}
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-sm text-slate-400"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL & TOAST */}

      <RestaurantDetailsModal
        restaurant={selected}
        onClose={() => setSelected(null)}
        onStatusChange={update}
      />

      <Toast
        message={notification}
        onClose={() => setNotification("")}
      />
    </>
  );
}