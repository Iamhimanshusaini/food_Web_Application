import { useNavigate } from "react-router-dom";
import { Store, Clock, ShoppingBag, IndianRupee, ClipboardList, ArrowUpRight, Utensils } from "lucide-react";
import PageHeading from "../components/PageHeading";
import StatCard from "../components/StatCard";
import RestaurantTable from "../components/RestaurantTable";
import RestaurantDetailsModal from "../components/RestaurantDetailsModal";
import Toast from "../components/Toast";
import { useSuperAdmin } from "../context/SuperAdminContext";
import { demoOrders } from "../data/demoData";
import { useState } from "react";

const money = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export default function Overview() {
  const navigate = useNavigate();
  const { restaurants, updateRestaurantStatus } = useSuperAdmin();
  const [selected, setSelected] = useState(null);
  const [notification, setNotification] = useState("");
  const pending = restaurants.filter((r) => r.status === "Pending").length;
  const update = (id, status) => { updateRestaurantStatus(id, status); setSelected(null); setNotification(`Restaurant ${status.toLowerCase()} successfully.`); };

  return <>
    <PageHeading title="Here's your business overview" description="Welcome back, Admin. Here's what's happening with your food delivery platform." action={<button onClick={() => navigate("/super-admin/approvals")} className="inline-flex items-center gap-2 self-start rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-100 hover:bg-orange-600"><ClipboardList size={17} />Review applications {pending > 0 && <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-xs">{pending}</span>}</button>} />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total restaurants" value={String(restaurants.length).padStart(2, "0")} change="+12.8%" icon={Store} />
      <StatCard title="Pending approvals" value={String(pending).padStart(2, "0")} change={`${pending} awaiting`} positive={pending === 0} icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-500" />
      <StatCard title="Total orders" value="12,840" change="+18.2%" icon={ShoppingBag} iconBg="bg-blue-50" iconColor="text-blue-500" />
      <StatCard title="Total revenue" value={money(842650)} change="+9.4%" icon={IndianRupee} iconBg="bg-emerald-50" iconColor="text-emerald-500" />
    </div>
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
      <div className="relative z-10 max-w-xl"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-orange-200"><span className="h-2 w-2 rounded-full bg-orange-400" />Your platform at a glance</span><h2 className="mt-4 text-2xl font-bold sm:text-3xl">Great food brings<br />people together.</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-300">Review new restaurant applications, monitor performance, and help customers discover their next favourite meal.</p><button onClick={() => navigate("/super-admin/restaurants")} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold hover:bg-orange-400">Explore restaurants <ArrowUpRight size={17} /></button></div>
      <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border-[40px] border-white/5" /><div className="pointer-events-none absolute -bottom-36 right-28 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" /><Utensils className="pointer-events-none absolute bottom-7 right-10 hidden h-32 w-32 rotate-12 text-white/10 sm:block" />
    </div>
    <RestaurantTable restaurants={restaurants} onStatusChange={update} onView={setSelected} />
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold text-slate-900">Recent orders</h2><p className="mt-1 text-sm text-slate-500">Latest orders across Foodly (sample data)</p></div><button onClick={() => navigate("/super-admin/orders")} className="text-sm font-semibold text-orange-600">View all <ArrowUpRight className="inline" size={15} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b border-slate-100 text-xs text-slate-400"><th className="py-3">Order ID</th><th className="py-3">Customer</th><th className="py-3">Restaurant</th><th className="py-3">Amount</th><th className="py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-50">{demoOrders.slice(0, 4).map(o => <tr key={o.id}><td className="py-4 text-sm font-bold text-orange-600">#{o.id}</td><td className="py-4 text-sm">{o.customer}</td><td className="py-4 text-sm">{o.restaurant}</td><td className="py-4 text-sm font-semibold">{money(o.amount)}</td><td className="py-4 text-sm">{o.status}</td></tr>)}</tbody></table></div></section>
    <RestaurantDetailsModal restaurant={selected} onClose={() => setSelected(null)} onStatusChange={update} />
    <Toast message={notification} onClose={() => setNotification("")} />
  </>;
}
