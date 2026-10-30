import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Users, Trash2 } from "lucide-react";

import PageHeading from "../components/PageHeading";
import StatusBadge from "../components/StatusBadge";
import Loader from "../../components/Loader";

import API from "../../api/api";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API}/customer/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.customers || res.data;

      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch customers error:", err);

      setError(
        err.response?.data?.message || "Customers load nahi ho paye."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Delete customer
  const handleDelete = async (id) => {
    setLoading(true)

    const confirmDelete = window.confirm(
      "if You delete Customer then with associated restaurant deleted automatically"
    );

    if (!confirmDelete) return;

    try {

      const res = await axios.delete(`${API}/customer/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);
      await fetchCustomers()

    } catch (err) {
      console.error("Delete customer error:", err);

      alert(
        err.response?.data?.message || "Customer delete nahi ho paya."
      );
    } finally {
      setLoading(false)
    }
  };

  // Search customers
  const filtered = customers.filter((c) =>
    `${c.name || ""} ${c.email || ""} ${c._id || c.id || ""} ${c.role || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Dashboard metrics
  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (c) => c.status?.toLowerCase() === "active"
  ).length;

  const newThisMonth = customers.filter((c) => {
    if (!c.createdAt) return false;

    const date = new Date(c.createdAt);
    const now = new Date();

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <>
      <PageHeading
        title="Customers"
        description="View and manage customer accounts and Foodly activity."
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric
          label="Total customers"
          value={totalCustomers.toLocaleString("en-IN")}
        />

        <Metric
          label="Active customers"
          value={activeCustomers.toLocaleString("en-IN")}
        />

        <Metric
          label="New this month"
          value={newThisMonth.toLocaleString("en-IN")}
        />
      </div>

      {/* Customer Table */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-slate-900">
              Customer directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage registered users and their roles.
            </p>
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-400 sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-slate-50 text-xs text-slate-400">
              <tr>
                {["Customer", "Email", "Phone", "Role", "Status", "Action"].map(
                  (heading) => (
                    <th key={heading} className="px-5 py-4">
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const name = c.name || "Unknown";
                  const id = c._id || c.id;

                  return (
                    <tr
                      key={id}
                      className="transition hover:bg-orange-50/30"
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                            {name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {c.email || "—"}
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {c.phone || "—"}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                          {c.role || "user"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={c.status || "active"} />
                      </td>

                      {/* Delete Action */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={16} />

                          {loading === true ? <Loader /> : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}

              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    <Users className="mx-auto mb-2 text-slate-300" />
                    No customers found
                  </td>
                </tr>
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