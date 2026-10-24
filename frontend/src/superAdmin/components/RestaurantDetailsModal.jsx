import { X } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function RestaurantDetailsModal({ restaurant, onClose, onStatusChange }) {
  if (!restaurant) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="relative h-36 bg-slate-100"><img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" /><button onClick={onClose} className="absolute right-3 top-3 rounded-xl bg-white/90 p-2 text-slate-600"><X size={18} /></button></div>
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-xl font-bold text-slate-900">{restaurant.name}</h3><p className="mt-1 text-sm text-slate-500">{restaurant.category} · {restaurant.location}</p></div><StatusBadge status={restaurant.status} /></div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Info label="Restaurant owner" value={restaurant.owner} /><Info label="Total orders" value={restaurant.orders.toLocaleString("en-IN")} /><Info label="Email" value={restaurant.email} /><Info label="Registration date" value={restaurant.joined} />
          </div>
          {restaurant.status === "Pending" ? <div className="mt-6 flex gap-3"><button onClick={() => onStatusChange(restaurant.id, "Rejected")} className="flex-1 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">Reject</button><button onClick={() => onStatusChange(restaurant.id, "Approved")} className="flex-1 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600">Approve restaurant</button></div> : <button onClick={onClose} className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white">Close details</button>}
        </div>
      </div>
    </div>
  );
}
function Info({ label, value }) {
  return <div className="min-w-0 rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p></div>;
}
