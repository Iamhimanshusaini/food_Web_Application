import { useLocation, useNavigate } from "react-router-dom";
import { Bell, CalendarDays, ChevronDown, Menu } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";
import { useAuth } from "../../context/AuthContext";
const pageNames = {
  "/super-admin": "Overview",
  "/super-admin/restaurants": "Restaurants",
  "/super-admin/approvals": "Approvals",
  "/super-admin/orders": "Orders",
  "/super-admin/customers": "Customers",
  "/super-admin/reviews": "Reviews",
  "/super-admin/settings": "Settings",
};

export default function SuperAdminHeader({ onMenuClick }) {
  const { user } = useAuth()
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurants } = useSuperAdmin();
  const page = pageNames[location.pathname] || "Overview";

  const pendingCount = restaurants.filter((restaurant) => restaurant.status === "Pending").length;

  return (
    <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur sm:px-7 lg:px-9">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden" aria-label="Open menu"><Menu size={20} /></button>
        <div><p className="text-xs font-medium text-slate-400">Super Admin / {page}</p><h2 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">{page === "Overview" ? "Restaurant Management" : page}</h2></div>
      </div>
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500 md:flex"><CalendarDays size={15} /><span>{new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span><ChevronDown size={14} /></div>
        <button onClick={() => navigate("/super-admin/approvals")} className="relative rounded-xl border border-slate-100 p-2.5 text-slate-500 transition hover:bg-orange-50 hover:text-orange-600" aria-label="Notifications"><Bell size={19} />{pendingCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-orange-500" />}</button>
        <div className="hidden h-8 w-px bg-slate-200 sm:block" />
        <div className="flex items-center gap-2.5 text-left"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700 ring-2 ring-orange-50">{user.name.charAt(0)}</div><div className="hidden sm:block"><p className="text-sm font-bold text-slate-800">{user.name}</p><p className="text-xs text-slate-400">Super Admin</p></div></div>
      </div>
    </header>
  );
}
