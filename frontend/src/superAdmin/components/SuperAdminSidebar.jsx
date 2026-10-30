import { NavLink } from "react-router-dom";
import { LayoutDashboard, Store, ClipboardList, Users, Star, Settings, Utensils, LogOut, ArrowUpRight, X, ShoppingBag } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";
import { useAuth } from "../../context/AuthContext";
const navigation = [
  { label: "Overview", path: "/super-admin", icon: LayoutDashboard, end: true },
  { label: "Restaurants", path: "/super-admin/restaurants", icon: Store },
  // { label: "Approvals", path: "/super-admin/approvals", icon: ClipboardList },
  { label: "Orders", path: "/super-admin/orders", icon: ShoppingBag },
  { label: "Customers", path: "/super-admin/customers", icon: Users },
  { label: "Reviews", path: "/super-admin/reviews", icon: Star },
  { label: "Settings", path: "/super-admin/settings", icon: Settings },
];

export default function SuperAdminSidebar({ isOpen, onClose }) {
  const { restaurants } = useSuperAdmin();
  const { user, logout } = useAuth()

  const pendingCount = restaurants.filter((restaurant) => restaurant.status === "Pending").length;

  return <>
    {isOpen && <button aria-label="Close sidebar backdrop" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-100 bg-white transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
      <div className="flex h-[82px] items-center justify-between border-b border-slate-100 px-6">
        <NavLink to="/super-admin" onClick={onClose} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-200"><Utensils size={22} /></div>
          <div><h1 className="text-xl font-extrabold tracking-tight text-slate-900">foodly<span className="text-orange-500">.</span></h1><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Super Admin</p></div>
        </NavLink>
        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden" onClick={onClose} aria-label="Close sidebar"><X size={20} /></button>
      </div>
      <div className="px-4 pt-7">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
        <nav className="space-y-1">
          {navigation.map(({ label, path, icon: Icon, end }) => <NavLink key={label} to={path} end={end} onClick={onClose} className={({ isActive }) => `group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition ${isActive ? "bg-orange-50 text-orange-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
            <span className="flex items-center gap-3"><Icon size={19} className="text-current" />{label}</span>
            {label === "Approvals" && pendingCount > 0 && <span className="rounded-lg bg-orange-500 px-2 py-0.5 text-[11px] font-bold text-white">{pendingCount}</span>}
          </NavLink>)}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20"><Store size={19} /></div>
          <p className="text-sm font-bold">Restaurant network</p>
          <p className="mt-1 text-xs leading-5 text-orange-50">Keep track of restaurants and grow your food business.</p>
          <NavLink to="/super-admin/restaurants" onClick={onClose} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-xs font-bold text-orange-600 hover:bg-orange-50">Manage restaurants <ArrowUpRight size={14} /></NavLink>
        </div>
        <button onClick={() => { logout(); window.location.href = "/login"; }} className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-red-600"><LogOut size={18} />Sign out</button>
        <span>ID: {user._id}</span>
      </div>
    </aside>
  </>;
}
