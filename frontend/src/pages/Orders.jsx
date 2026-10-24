import { Link } from "react-router-dom";
import {
  ArrowRight, Clock, MapPin, PackageCheck,
  CreditCard
} from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
export default function Orders() {
  const { user } = useAuth()
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([])
  const getAllOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

      setOrders(res.data.orders)

    } catch (error) {
      console.log(error)
      console.log(error.response?.data?.message)
    }
  }

  useEffect(() => {
    if (token) {
      getAllOrders()
    }

  }, [token])
  const FilterUserOrders = orders.filter((order) => user?._id === order.customerId)
  // console.log("First Order:", orders);

  return (
    <div className="mx-3 space-y-4 sm:mx-6 lg:mx-10">
      {FilterUserOrders.map((order) => {
        const total =
          Number(order.subtotal || 0) +
          Number(order.deliveryCharge || 0) +
          Number(order.tax || 0) -
          Number(order.discount || 0);

        const isPaid =
          String(order.paymentStatus).toLowerCase() === "paid";

        return (
          <>
            <div
              key={order._id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg"
            >
              {/* Orange accent */}
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-orange-400 to-orange-600" />

              <div className="flex items-center gap-3 p-3 pl-4 sm:gap-5 sm:p-4 sm:pl-5">
                {/* Food image */}
                <div className="relative shrink-0">
                  <img
                    src={order.items?.[0]?.image}
                    alt={order.items?.[0]?.name || "Food"}
                    className="h-[82px] w-[82px] rounded-xl object-cover ring-1 ring-black/5 sm:h-24 sm:w-24"
                  />

                  {order.items?.length > 1 && (
                    <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-gray-900 px-2 py-1 text-[10px] font-bold text-white ring-2 ring-white">
                      +{order.items.length - 1}
                    </span>
                  )}
                </div>

                {/* Order details */}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-gray-400">
                    Order ID:{" "}
                    <span className="font-bold text-gray-600">
                      #{order.orderId}
                    </span>
                  </p>

                  <h3 className="mt-1 truncate text-sm font-extrabold text-gray-900 sm:text-base">
                    {order.items?.map((item) => item.name).join(", ")}
                  </h3>

                  <p className="mt-1.5 text-lg font-black tracking-tight text-gray-900">
                    ₹{total.toFixed(2)}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-bold text-gray-600">
                      {(order.paymentMethod || "N/A").toUpperCase()}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-extrabold ${isPaid
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                        }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${isPaid ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                      />
                      {order.paymentStatus || "PENDING"}
                    </span>
                  </div>
                </div>

                {/* Details button */}
                <Link
                  to={`/orders/${order._id}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2.5 text-xs font-bold text-white shadow-sm shadow-orange-200 transition-all hover:bg-orange-600 hover:shadow-md active:scale-95 sm:px-4 sm:text-sm"
                >
                  <span>Details</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </>

        );
      })}
    </div>
  );
}