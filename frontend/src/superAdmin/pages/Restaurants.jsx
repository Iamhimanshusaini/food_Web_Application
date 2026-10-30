
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Store,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  LoaderCircle,
  UtensilsCrossed,
  X,
  AlertCircle,
} from "lucide-react";
import API from "../../api/api";
import Loader from "../../components/Loader";
import axios from "axios";
import { useSuperAdmin } from "../context/SuperAdminContext"
const AllRestaurants = () => {
  // const { setRestaurants,restaurants } = useSuperAdmin()
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Approval state
  const [isApproved, setIsApproved] = useState({});

  // Rejection modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const getStatus = (restaurant) => {
    if (restaurant.isApproved === true) return "approved";
    if (restaurant.isApproved === false) return "pending";
    return "pending";
  };

  // Fetch all restaurants
  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API}/super-admin/restaurants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const restaurantList = response.data.restaurants || [];

      setRestaurants(restaurantList);

      const approvalState = {};

      restaurantList.forEach((restaurant) => {
        approvalState[restaurant._id] = restaurant.isApproved === true;
      });

      setIsApproved(approvalState);

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch restaurants"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Common PUT API for approve and reject
  const approveRestaurant = async (id, approvalValue, reason = "") => {
    setActionId(id);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API}/super-admin/restaurants/${id}/approve`,
        {
          isApproved: approvalValue,
          ...(approvalValue === false
            ? { rejectionReason: reason.trim() }
            : {}),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state
      setIsApproved((prev) => ({
        ...prev,
        [id]: approvalValue,
      }));

      setRestaurants((prev) =>
        prev.map((restaurant) =>
          restaurant._id === id
            ? {
              ...restaurant,
              ...(res.data.restaurant || {}),
              isApproved: approvalValue,
            }
            : restaurant
        )
      );

      setSuccess(res.data.message || "Restaurant status updated successfully");

      setShowRejectModal(false);
      setSelectedRestaurant(null);
      setRejectionReason("");

      if (res.data.emailSent === false) {
        setError(
          "Status updated, but the owner notification email could not be sent."
        );
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Restaurant status update failed"
      );
    } finally {
      setActionId(null);
    }
  };

  // Approve action
  const handleApprove = (restaurant) => {
    const confirmed = window.confirm(
      `Are you sure you want to approve ${restaurant.name}?`
    );

    if (!confirmed) return;

    approveRestaurant(restaurant._id, true);
  };

  // Open reject modal
  const handleReject = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setRejectionReason("");
    setError("");
    setShowRejectModal(true);
  };

  // Submit rejection
  const handleRejectSubmit = (e) => {
    e.preventDefault();

    const reason = rejectionReason.trim();

    if (reason.length < 10) {
      setError("Please enter a valid reason (minimum 10 characters).");
      return;
    }

    if (reason.length > 500) {
      setError("Reason cannot exceed 500 characters.");
      return;
    }

    approveRestaurant(selectedRestaurant._id, false, reason);
  };

  // Search and filters
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const status = getStatus(restaurant);
    const query = search.trim().toLowerCase();

    const matchesSearch = [
      restaurant.name,
      restaurant.email,
      restaurant.phone,
      restaurant.address,
      restaurant.location,
    ].some((value) =>
      String(value || "").toLowerCase().includes(query)
    );

    const matchesFilter = filter === "all" || filter === status;

    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: restaurants.length,
    pending: restaurants.filter(
      (restaurant) => getStatus(restaurant) === "pending"
    ).length,
    approved: restaurants.filter(
      (restaurant) => getStatus(restaurant) === "approved"
    ).length,
  };

  const statusStyle = (status) => {
    if (status === "approved") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-orange-600">
              SUPER ADMIN / MANAGEMENT
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              All Restaurants
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage restaurant registrations and approvals.
            </p>
          </div>

          <button
            onClick={fetchRestaurants}
            disabled={loading || actionId !== null}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Restaurants"
            count={counts.all}
            icon={<Store size={22} />}
            color="bg-orange-100 text-orange-600"
          />

          <StatCard
            title="Pending Approval"
            count={counts.pending}
            icon={<Clock size={22} />}
            color="bg-amber-100 text-amber-600"
          />

          <StatCard
            title="Approved"
            count={counts.approved}
            icon={<CheckCircle size={22} />}
            color="bg-emerald-100 text-emerald-600"
          />
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="ml-auto"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle size={18} />
            {success}
            <button
              onClick={() => setSuccess("")}
              className="ml-auto"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Search and filter */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone or address..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${filter === item.value
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant cards */}
        {loading ? (
          <Loader />
        ) : filteredRestaurants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center">
            <Store className="mx-auto text-slate-300" size={42} />

            <h3 className="mt-4 font-semibold text-slate-800">
              No restaurants found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or selected filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredRestaurants.map((restaurant) => {
              const status = getStatus(restaurant);
              const approved = isApproved[restaurant._id] === true;

              return (
                <div
                  key={restaurant._id}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Restaurant details */}
                  <div className="flex gap-4 p-5">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-orange-50">
                      {restaurant.image ? (
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-orange-400">
                          <UtensilsCrossed size={32} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h2 className="break-words text-lg font-bold text-slate-900">
                          {restaurant.name}
                        </h2>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(status)}`}
                        >
                          {approved ? (
                            <CheckCircle size={13} />
                          ) : (
                            <Clock size={13} />
                          )}

                          {status}
                        </span>
                      </div>

                      <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                        <MapPin size={16} className="mt-0.5 shrink-0" />

                        <span className="break-words">
                          {restaurant.address ||
                            restaurant.location ||
                            "Address not provided"}
                        </span>
                      </p>

                      {restaurant.cuisine && (
                        <p className="mt-2 text-xs text-slate-500">
                          Cuisine:{" "}
                          {Array.isArray(restaurant.cuisine)
                            ? restaurant.cuisine.join(", ")
                            : restaurant.cuisine}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mx-5 border-t border-slate-100" />

                  {/* Contact details */}
                  <div className="grid gap-3 p-5 sm:grid-cols-2">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                        <Mail size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">Email</p>
                        <p className="break-all text-sm font-medium text-slate-700">
                          {restaurant.email || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-start gap-3">
                      <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                        <Phone size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">Phone</p>
                        <p className="break-words text-sm font-medium text-slate-700">
                          {restaurant.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 p-4">
                    <span className="text-xs text-slate-500">
                      ID: {restaurant._id}
                    </span>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleReject(restaurant)}
                        disabled={actionId === restaurant._id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <XCircle size={17} />
                        Reject
                      </button>

                      <button
                        onClick={() => handleApprove(restaurant)}
                        disabled={actionId === restaurant._id || approved}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionId === restaurant._id ? (
                          <LoaderCircle size={17} className="animate-spin" />
                        ) : (
                          <CheckCircle size={17} />
                        )}

                        {actionId === restaurant._id
                          ? "Updating..."
                          : approved
                            ? "Approved"
                            : "Approve"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-slate-400">
          Showing {filteredRestaurants.length} of {restaurants.length} restaurants
        </p>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Reject Restaurant
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedRestaurant.name}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRestaurant(null);
                  setRejectionReason("");
                  setError("");
                }}
                disabled={actionId !== null}
                className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit}>
              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Reason for rejection
                  <span className="text-red-500"> *</span>
                </label>

                <textarea
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    setError("");
                  }}
                  rows={5}
                  maxLength={500}
                  required
                  placeholder="Enter valid reason for rejecting this restaurant..."
                  className="w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />

                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>Minimum 10 characters required</span>
                  <span>{rejectionReason.length}/500</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={actionId !== null}
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedRestaurant(null);
                    setRejectionReason("");
                    setError("");
                  }}
                  className="rounded-xl border px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    actionId !== null ||
                    rejectionReason.trim().length < 10
                  }
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionId === selectedRestaurant._id ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <XCircle size={17} />
                  )}

                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, count, icon, color }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
    <div className={`rounded-xl p-3 ${color}`}>
      {icon}
    </div>

    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">
        {count}
      </p>
    </div>
  </div>
);

export default AllRestaurants;
