import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  UserRound,
  Store,
  MapPin,
  CalendarDays,
  CreditCard,
  Package,
  Receipt,
} from "lucide-react";

import Loader from "../../components/Loader";
import PageHeading from "../components/PageHeading";
import StatusBadge from "../components/StatusBadge";
import API from "../../api/api";

// =========================
// Currency format
// =========================
const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

// =========================
// Date format
// =========================
const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// =========================
// Status format
// =========================
const normalizeStatus = (status = "") => {
  const value = String(status)
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .trim();

  const statuses = {
    delivered: "Delivered",
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    processing: "Preparing",
    cancelled: "Cancelled",
    canceled: "Cancelled",
    "out for delivery": "Out for delivery",
    shipped: "Out for delivery",
  };

  return (
    statuses[value] ||
    value.replace(/\b\w/g, (char) => char.toUpperCase()) ||
    "Pending"
  );
};

// =========================
// Calculate order total
// subtotal + delivery + tax - discount
// =========================
const getAmount = (order) => {
  const subtotal =
    order.subtotal ??
    (order.items || []).reduce(
      (total, item) =>
        total +
        Number(item.price || 0) * Number(item.quantity || 1),
      0
    );

  return (
    Number(subtotal || 0) +
    Number(order.deliveryCharge || 0) +
    Number(order.tax || 0) -
    Number(order.discount || 0)
  );
};

// =========================
// Main Order Details
// =========================
export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
        setOrder(null);

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Login token nahi mila. Please dobara login karein.");
          return;
        }

        // API request
        const res = await axios.get(
          `${API}/order/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseData = res.data;

        // API can return:
        // { success: true, orders: [...] }
        // { success: true, order: {...} }
        // or a direct order object.
        const responseOrders = responseData.orders;

        let foundOrder = null;

        if (Array.isArray(responseOrders)) {
          foundOrder =
            responseOrders.find(
              (item) =>
                String(item.orderId) === String(id) ||
                String(item._id) === String(id)
            ) ||
            (responseOrders.length === 1
              ? responseOrders[0]
              : null);
        } else if (responseData.order) {
          foundOrder = responseData.order;
        } else if (responseOrders && typeof responseOrders === "object") {
          foundOrder = responseOrders;
        } else if (responseData._id || responseData.orderId) {
          foundOrder = responseData;
        }

        if (!foundOrder) {
          setError(
            responseData.message || "Is Order ID ka order nahi mila."
          );
          return;
        }

        setOrder(foundOrder);
      } catch (err) {
        console.error("Fetch order details error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Order details fetch nahi ho paayi."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    } else {
      setError("Order ID missing hai.");
      setLoading(false);
    }
  }, [id]);

  // =========================
  // Loading state
  // =========================
  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <Loader />
      </div>
    );
  }

  // =========================
  // Error state
  // =========================
  if (error || !order) {
    return (
      <section className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <ShoppingBag
          className="mx-auto mb-3 text-slate-300"
          size={36}
        />

        <h2 className="font-bold text-slate-800">
          Unable to load order
        </h2>

        <p className="mt-2 text-sm text-red-500">
          {error || "Order not found"}
        </p>

        <Link
          to="/super-admin/orders"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
      </section>
    );
  }

  // =========================
  // Extract correct fields
  // =========================
  const customer =
    order.customerId && typeof order.customerId === "object"
      ? order.customerId
      : null;

  const deliveryAddress =
    typeof order.deliveryAddress === "object" &&
    order.deliveryAddress !== null
      ? order.deliveryAddress
      : {};

  const customerName =
    deliveryAddress.fullName ||
    order.customer ||
    order.customerName ||
    customer?.name ||
    "Unknown Customer";

  const customerPhone =
    deliveryAddress.phone ||
    customer?.phone ||
    order.customerPhone;

  const customerId =
    customer?._id ||
    (typeof order.customerId === "string"
      ? order.customerId
      : order.customerId?._id);

  const items = Array.isArray(order.items) ? order.items : [];

  const itemsTotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const total = getAmount(order);

  const restaurantNames = [
    ...new Set(
      items
        .map((item) => {
          if (
            item.restaurantId &&
            typeof item.restaurantId === "object"
          ) {
            return item.restaurantId.name;
          }

          return (
            item.restaurantName ||
            item.restaurant?.name ||
            null
          );
        })
        .filter(Boolean)
    ),
  ];

  const orderStatus = normalizeStatus(order.orderStatus || order.status);

  return (
    <>
      {/* Back button */}
      <div className="mb-5">
        <Link
          to="/super-admin/orders"
          className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Orders
        </Link>
      </div>

      {/* Heading */}
      <PageHeading
        title={`Order #${order.orderId || order._id}`}
        description="Complete details of this Foodly order."
      />

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Order Amount"
          value={money(total)}
          icon={<Receipt size={20} />}
        />

        <Metric
          label="Payment Method"
          value={order.paymentMethod || "—"}
          icon={<CreditCard size={20} />}
        />

        <Metric
          label="Payment Status"
          value={order.paymentStatus || "—"}
          icon={<Package size={20} />}
        />

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Order Status</p>

          <div className="mt-3">
            <StatusBadge status={orderStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left side */}
        <div className="space-y-5 lg:col-span-2">
          {/* Ordered items */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
              <ShoppingBag size={20} className="text-orange-500" />
              Ordered Items ({items.length})
            </h3>

            {items.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {items.map((item, index) => (
                  <div
                    key={item._id || `${item.name}-${index}`}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name || "Food"}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                        <ShoppingBag className="text-orange-400" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800">
                        {item.name || "Food item"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {money(item.price)} × {item.quantity || 1}
                      </p>

                      {typeof item.restaurantId === "object" &&
                        item.restaurantId?.name && (
                          <p className="mt-1 text-xs text-slate-400">
                            {item.restaurantId.name}
                          </p>
                        )}
                    </div>

                    <p className="whitespace-nowrap font-bold text-slate-800">
                      {money(
                        Number(item.price || 0) *
                          Number(item.quantity || 1)
                      )}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-slate-500">
                No items found in this order.
              </p>
            )}

            {/* Bill summary */}
            <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
              <BillRow label="Items subtotal" value={money(order.subtotal ?? itemsTotal)} />

              <BillRow
                label="Delivery charge"
                value={money(order.deliveryCharge || 0)}
              />

              <BillRow
                label="Tax"
                value={money(order.tax || 0)}
              />

              <BillRow
                label="Discount"
                value={`−${money(order.discount || 0)}`}
              />

              <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-extrabold text-slate-900">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>
          </section>

          {/* Restaurant details */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
              <Store size={20} className="text-orange-500" />
              Restaurant Details
            </h3>

            {restaurantNames.length > 0 ? (
              <div className="space-y-3">
                {restaurantNames.map((name) => (
                  <div
                    key={name}
                    className="rounded-xl bg-slate-50 p-4"
                  >
                    <p className="font-semibold text-slate-800">
                      {name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="rounded-xl bg-slate-50 p-4"
                    >
                      <p className="text-xs text-slate-400">
                        Restaurant ID
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-slate-700">
                        {typeof item.restaurantId === "object"
                          ? item.restaurantId?._id || "—"
                          : item.restaurantId || "—"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Restaurant information is not available.
                  </p>
                )}

                <p className="text-xs text-slate-400">
                  Restaurant name dikhane ke liye backend se
                  items.restaurantId populate karna hoga.
                </p>
              </div>
            )}
          </section>

          {/* Special instructions */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-slate-900">
              Special Instructions
            </h3>

            <p className="text-sm text-slate-600">
              {order.specialInstructions || "No special instructions."}
            </p>
          </section>
        </div>

        {/* Right side */}
        <div className="space-y-5">
          {/* Customer details */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
              <UserRound size={20} className="text-orange-500" />
              Customer Details
            </h3>

            <Detail label="Name" value={customerName} />

            <Detail
              label="Email"
              value={customer?.email || order.customerEmail}
            />

            <Detail label="Phone" value={customerPhone} />

            <Detail label="Customer ID" value={customerId} />
          </section>

          {/* Payment details */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
              <CreditCard size={20} className="text-orange-500" />
              Payment Details
            </h3>

            <Detail
              label="Payment Method"
              value={order.paymentMethod}
            />

            <Detail
              label="Payment Status"
              value={order.paymentStatus}
            />

            <Detail
              label="Razorpay Order ID"
              value={order.razorpayOrderId}
            />

            <Detail
              label="Razorpay Payment ID"
              value={order.razorpayPaymentId}
            />

            <Detail
              label="Order Amount"
              value={money(total)}
            />
          </section>

          {/* Delivery address */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
              <MapPin size={20} className="text-orange-500" />
              Delivery Address
            </h3>

            <Detail
              label="Full Name"
              value={deliveryAddress.fullName}
            />

            <Detail
              label="Phone"
              value={deliveryAddress.phone}
            />

            <Detail
              label="Address"
              value={deliveryAddress.address}
            />

            <Detail
              label="City"
              value={deliveryAddress.city}
            />

            <Detail
              label="State"
              value={deliveryAddress.state}
            />

            <Detail
              label="Pincode"
              value={deliveryAddress.pincode}
            />

            <Detail
              label="Landmark"
              value={deliveryAddress.landmark}
            />
          </section>

          {/* Order information */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
              <CalendarDays size={20} className="text-orange-500" />
              Order Information
            </h3>

            <Detail
              label="Order ID"
              value={order.orderId || order._id}
            />

            <Detail
              label="Database ID"
              value={order._id}
            />

            <Detail
              label="Created At"
              value={formatDate(order.createdAt)}
            />

            <Detail
              label="Updated At"
              value={formatDate(order.updatedAt)}
            />

            <Detail
              label="Estimated Delivery"
              value={formatDate(order.estimatedDeliveryTime)}
            />

            <Detail
              label="Delivered At"
              value={formatDate(order.deliveredAt)}
            />

            <Detail
              label="Cancelled At"
              value={formatDate(order.cancelledAt)}
            />
          </section>
        </div>
      </div>
    </>
  );
}

// =========================
// Reusable detail row
// =========================
function Detail({ label, value }) {
  return (
    <div className="border-b border-slate-50 py-3 last:border-0">
      <p className="text-xs text-slate-400">{label}</p>

      <p className="mt-1 break-words text-sm font-medium text-slate-700">
        {value == null || value === "" ? "—" : String(value)}
      </p>
    </div>
  );
}

// =========================
// Reusable metric card
// =========================
function Metric({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{label}</p>

        <span className="text-orange-500">{icon}</span>
      </div>

      <p className="mt-3 break-words text-xl font-extrabold capitalize text-slate-900">
        {value}
      </p>
    </div>
  );
}

// =========================
// Reusable bill row
// =========================
function BillRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-slate-500">
      <span>{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  );
}