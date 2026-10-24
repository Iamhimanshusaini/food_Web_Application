import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, MapPin, Star, Eye, CheckCircle2, XCircle, MoreHorizontal, Store } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function RestaurantTable({ restaurants, onStatusChange, onView, approvalsOnly = false }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(approvalsOnly ? "Pending" : "All");

  const filtered = useMemo(() => restaurants.filter((restaurant) => {
    const text = search.toLowerCase();
    const matchesSearch = [restaurant.name, restaurant.owner, restaurant.category, restaurant.location]
      .some((value) => value.toLowerCase().includes(text));
    const matchesStatus = statusFilter === "All" || restaurant.status === statusFilter;
    return matchesSearch && matchesStatus && (!approvalsOnly || restaurant.status === "Pending");
  }), [restaurants, search, statusFilter, approvalsOnly]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{approvalsOnly ? "Pending applications" : "Restaurant directory"}</h2>
          <p className="mt-1 text-sm text-slate-500">{approvalsOnly ? "Review and manage restaurant registration requests." : "Search and manage restaurants on your platform."}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search restaurants..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 sm:w-56" />
          </div>
          <div className="relative">
            <SlidersHorizontal size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 py-2.5 pl-9 pr-9 text-sm outline-none focus:border-orange-400 sm:w-40">
              <option value="All">All statuses</option><option value="Approved">Approved</option><option value="Pending">Pending</option><option value="Rejected">Rejected</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead className="bg-slate-50/80"><tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <th className="px-6 py-4">Restaurant</th><th className="px-5 py-4">Owner</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Orders</th><th className="px-5 py-4">Rating</th><th className="px-5 py-4 text-right">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((restaurant) => <tr key={restaurant.id} className="transition hover:bg-orange-50/30">
              <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={restaurant.image} alt={restaurant.name} className="h-12 w-12 rounded-xl object-cover" /><div><p className="font-semibold text-slate-800">{restaurant.name}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><MapPin size={12} />{restaurant.location}</p></div></div></td>
              <td className="px-5 py-4"><p className="text-sm font-medium text-slate-700">{restaurant.owner}</p><p className="mt-1 text-xs text-slate-400">{restaurant.email}</p></td>
              <td className="px-5 py-4"><span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">{restaurant.category}</span></td>
              <td className="px-5 py-4"><StatusBadge status={restaurant.status} /></td>
              <td className="px-5 py-4 text-sm font-semibold text-slate-700">{restaurant.orders.toLocaleString("en-IN")}</td>
              <td className="px-5 py-4">{restaurant.rating > 0 ? <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700"><Star size={15} className="fill-amber-400 text-amber-400" />{restaurant.rating.toFixed(1)}</span> : <span className="text-xs text-slate-400">No ratings</span>}</td>
              <td className="px-5 py-4"><div className="flex items-center justify-end gap-2">
                <button title="View details" onClick={() => onView(restaurant)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"><Eye size={16} /></button>
                {restaurant.status === "Pending" ? <>
                  <button title="Approve" onClick={() => onStatusChange(restaurant.id, "Approved")} className="rounded-lg bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100"><CheckCircle2 size={17} /></button>
                  <button title="Reject" onClick={() => onStatusChange(restaurant.id, "Rejected")} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><XCircle size={17} /></button>
                </> : <button title="More actions" onClick={() => onView(restaurant)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><MoreHorizontal size={18} /></button>}
              </div></td>
            </tr>)}
            {filtered.length === 0 && <tr><td colSpan={7} className="px-6 py-16 text-center"><Store size={25} className="mx-auto text-slate-300" /><p className="mt-3 font-semibold text-slate-700">No restaurants found</p><p className="mt-1 text-sm text-slate-400">Try another search or filter.</p></td></tr>}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:px-6">Showing <strong className="text-slate-700">{filtered.length}</strong> of <strong className="text-slate-700">{restaurants.length}</strong> restaurants</div>
    </section>
  );
}
