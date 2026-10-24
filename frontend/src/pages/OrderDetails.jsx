import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Clock3,
  Package,
  Bike,
  Home,
  MapPin,
  CreditCard,
  Receipt,
  Phone,
  CalendarDays,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api/api";

const steps = [
  { title: "Order confirmed", description: "Your order has been confirmed", icon: Check },
  { title: "Preparing food", description: "Restaurant is preparing your food", icon: Package },
  { title: "Out for delivery", description: "Delivery partner is on the way", icon: Bike },
  { title: "Delivered", description: "Enjoy your delicious meal!", icon: Home },
];

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

export default function OrderDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getOrder = async () => {
      if (!token) {
        setError("Please login to view your order.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allOrders = res.data.orders || [];

        const foundOrder = allOrders.find(
          (item) => String(item._id) === String(id)
        );

        if (!foundOrder) {
          setError("Order not found.");
          setOrder(null);
          return;
        }

        setOrder(foundOrder);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message || "Unable to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-4xl">
          📦
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900">
          {error || "Order not found"}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          We couldn't find the order you're looking for.
        </p>

        <Link
          to="/orders"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          <ArrowLeft size={17} />
          Back to orders
        </Link>
      </div>
    );
  }

  const address = order.deliveryAddress || {};

  const subtotal = Number(
    order.subtotal ??
      order.items?.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ) ??
      0
  );

  const deliveryCharge = Number(order.deliveryCharge || 0);
  const tax = Number(order.tax || 0);
  const discount = Number(order.discount || 0);

  const total =
    subtotal + deliveryCharge + tax - discount;

  const status = String(order.orderStatus || "Confirmed").toLowerCase();

  const currentStep =
    status === "delivered"
      ? 3
      : status === "out for delivery" ||
          status === "shipped" ||
          status === "picked up"
        ? 2
        : status === "preparing" ||
            status === "preparing food" ||
            status === "processing"
          ? 1
          : 0;

  const isCancelled = status === "cancelled";
  const isPaid = String(order.paymentStatus || "").toLowerCase() === "paid";

  return (
    <div className="min-h-screen bg-gray-50/70 px-3 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        {/* Back button */}
        <Link
          to="/orders"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-600"
        >
          <ArrowLeft size={17} />
          Back to orders
        </Link>

        {/* Order heading */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[2px] text-orange-500">
                Order details
              </span>

              <h1 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
                #{order.orderId || order._id}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <CalendarDays size={16} />
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-xl px-4 py-2 text-sm font-bold ${
                  isCancelled
                    ? "bg-red-50 text-red-600"
                    : "bg-orange-50 text-orange-600"
                }`}
              >
                {order.orderStatus || "Confirmed"}
              </span>

              <span
                className={`rounded-xl px-4 py-2 text-sm font-bold ${
                  isPaid
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                Payment: {order.paymentStatus || "PENDING"}
              </span>
            </div>
          </div>
        </div>

        {/* Order tracking */}
        <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold text-gray-900">
              <Clock3 className="mr-2 inline text-orange-500" size={20} />
              Track your order
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current status: {order.orderStatus || "Confirmed"}
            </p>
          </div>

          {isCancelled ? (
            <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
              This order has been cancelled.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const completed = index <= currentStep;

                return (
                  <div key={step.title} className="relative">
                    <div
                      className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${
                        completed
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <h3
                      className={`text-sm font-bold ${
                        completed ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-gray-900">
                  Ordered items
                </h2>

                <span className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
                  {order.items?.length || 0} item type(s)
                </span>
              </div>

              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3 sm:gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name || "Food"}
                      className="h-20 w-20 shrink-0 rounded-xl bg-gray-100 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-600">
                        {formatPrice(item.price)} each
                      </p>

                      {item.restaurantId && (
                        <p className="mt-1 truncate text-xs text-gray-400">
                          Restaurant ID:{" "}
                          {typeof item.restaurantId === "object"
                            ? item.restaurantId._id || item.restaurantId.$oid
                            : item.restaurantId}
                        </p>
                      )}
                    </div>

                    <p className="shrink-0 text-sm font-extrabold text-gray-900">
                      {formatPrice(
                        Number(item.price || 0) *
                          Number(item.quantity || 1)
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 text-lg font-extrabold text-gray-900">
                <MapPin className="mr-2 inline text-orange-500" size={20} />
                Delivery address
              </h2>

              <div className="rounded-2xl bg-gray-50 p-4">
                <h3 className="font-bold text-gray-900">
                  {address.fullName || order.customer || "Customer"}
                </h3>

                {address.phone && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={15} />
                    {address.phone}
                  </p>
                )}

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {[address.address, address.landmark, address.city, address.state, address.pincode]
                    .filter(Boolean)
                    .join(", ") || "No delivery address provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment summary */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-5 text-lg font-extrabold text-gray-900">
                <Receipt className="mr-2 inline text-orange-500" size={20} />
                Bill summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-3 text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-gray-500">
                  <span>Delivery charge</span>
                  <span className="font-semibold text-gray-800">
                    {formatPrice(deliveryCharge)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-gray-500">
                  <span>Tax</span>
                  <span className="font-semibold text-gray-800">
                    {formatPrice(tax)}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-gray-500">
                  <span>Discount</span>
                  <span className="font-semibold text-emerald-600">
                    -{formatPrice(discount)}
                  </span>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-gray-900">Total paid / due</span>
                    <span className="text-xl font-black text-orange-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
                    <CreditCard size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Payment method</p>
                    <p className="mt-1 break-words text-sm font-bold uppercase text-gray-900">
                      {order.paymentMethod || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-500">Payment status</span>
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                      isPaid
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.paymentStatus || "PENDING"}
                  </span>
                </div>
              </div>

              {order.razorpayOrderId && (
                <div className="mt-4 break-all text-xs text-gray-400">
                  <p>Razorpay Order ID</p>
                  <p className="mt-1 font-medium text-gray-600">
                    {order.razorpayOrderId}
                  </p>
                </div>
              )}

              {order.razorpayPaymentId && (
                <div className="mt-3 break-all text-xs text-gray-400">
                  <p>Razorpay Payment ID</p>
                  <p className="mt-1 font-medium text-gray-600">
                    {order.razorpayPaymentId}
                  </p>
                </div>
              )}
            </div>

            {/* Customer info */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 text-base font-extrabold text-gray-900">
                Order information
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Order ID</span>
                  <span className="text-right font-semibold text-gray-800">
                    {order.orderId || order._id}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Customer</span>
                  <span className="text-right font-semibold text-gray-800">
                    {order.customer || address.fullName || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Order date</span>
                  <span className="text-right font-semibold text-gray-800">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Last updated</span>
                  <span className="text-right font-semibold text-gray-800">
                    {formatDate(order.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}