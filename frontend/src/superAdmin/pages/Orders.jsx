import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, ShoppingBag, Eye, ArrowUpRight } from "lucide-react";
import PageHeading from "../components/PageHeading";
import StatusBadge from "../components/StatusBadge";
import { Link } from "react-router-dom";
import API from "../../api/api";

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const normalizeStatus = (status = "") => {
  const value = status.toLowerCase().replace(/[_-]/g, " ");

  const statusMap = {
    delivered: "Delivered",
    preparing: "Preparing",
    pending: "Pending",
    cancelled: "Cancelled",
    confirmed: "Confirmed",
    processing: "Preparing",
    "out for delivery": "Out for delivery",
    shipped: "Out for delivery",
  };

  return (
    statusMap[value] ||
    value.replace(/\b\w/g, (char) => char.toUpperCase()) ||
    "Pending"
  );
};

const getAmount = (order) => {
  if (order.totalAmount != null) return Number(order.totalAmount);
  if (order.totalPrice != null) return Number(order.totalPrice);
  if (order.amount != null) return Number(order.amount);

  const itemsTotal = (order.items || []).reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  return itemsTotal + Number(order.deliveryCharge || 0);
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Orders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // API response: { orders: [...] } ya direct [...]
        const data = res.data.orders || res.data.data || res.data;

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch orders error:", err);

        setError(
          err.response?.data?.message || "Orders fetch nahi ho paaye."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Backend orders ko table ke format mein convert karna
  const formattedOrders = useMemo(() => {
    return orders.map((order) => {
      const items = order.items || [];

      const restaurantNames = [
        ...new Set(
          items
            .map(
              (item) =>
                item.restaurantName ||
                item.restaurant?.name ||
                item.restaurantId?.name
            )
            .filter(Boolean)
        ),
      ];

      return {
        id: order.orderId || order._id || order.id,
        customer:
          order.customerName ||
          order.customer?.name ||
          order.name ||
          "Unknown Customer",
        restaurant:
          order.restaurantName ||
          order.restaurant?.name ||
          restaurantNames.join(", ") ||
          "—",
        date: formatDate(order.createdAt || order.orderDate),
        amount: getAmount(order),
        status: normalizeStatus(order.orderStatus || order.status),
      };
    });
  }, [orders]);

  // Search aur status filter
  const filtered = useMemo(() => {
    return formattedOrders.filter((order) => {
      const matchesSearch = (
        `${order.id} ${order.customer} ${order.restaurant}`
      )
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [formattedOrders, search, status]);

  // Real API data se metrics
  const totalOrders = formattedOrders.length;

  const deliveredOrders = formattedOrders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const inProgressOrders = formattedOrders.filter((order) =>
    ["Preparing", "Confirmed", "Out for delivery"].includes(order.status)
  ).length;
  return (
    <>
      <PageHeading
        title="Orders"
        description="Monitor order activity across all restaurants on Foodly."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric
          label="Total orders"
          value={totalOrders.toLocaleString("en-IN")}
        />

        <Metric
          label="Delivered"
          value={deliveredOrders.toLocaleString("en-IN")}
        />

        <Metric
          label="In progress"
          value={inProgressOrders.toLocaleString("en-IN")}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row">
          <div>
            <h2 className="font-bold text-slate-900">Order directory</h2>
            <p className="mt-1 text-sm text-slate-500">
              All orders from Foodly
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              {[
                "All",
                "Pending",
                "Confirmed",
                "Preparing",
                "Out for delivery",
                "Delivered",
                "Cancelled",
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-slate-50 text-xs text-slate-400">
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Restaurant",
                  "Date",
                  "Amount",
                  "Status",
                ].map((heading) => (
                  <th key={heading} className="px-5 py-4">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : !error && filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    <ShoppingBag className="mx-auto mb-2 text-slate-300" />
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-orange-50/30"
                  >
                    <td className="px-5 py-4 font-bold text-orange-600">
                      <Link
                        to={`/super-admin/order/${order?.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
                      >

                        #{order.id}
                        <ArrowUpRight
                          size={15}
                          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </Link>

                    </td>

                    <td className="px-5 py-4 text-sm">
                      {order?.customerId?.name}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {order.restaurant}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {order.date}
                    </td>

                    <td className="px-5 py-4 text-sm font-bold">
                      {money(order.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/super-admin/order/${order._id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
                      >
                        <Eye size={16} />
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-slate-900">
        {value}
      </p>
    </div>
  );
}