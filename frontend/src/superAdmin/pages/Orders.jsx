import { useMemo, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import PageHeading from "../components/PageHeading";
import StatusBadge from "../components/StatusBadge";
import { demoOrders } from "../data/demoData";

const money = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
export default function Orders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const filtered = useMemo(() => demoOrders.filter(o => (`${o.id} ${o.customer} ${o.restaurant}`).toLowerCase().includes(search.toLowerCase()) && (status === "All" || o.status === status)), [search, status]);
  return <>
    <PageHeading title="Orders" description="Monitor order activity across all restaurants on Foodly." />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Metric label="All orders (demo)" value="1,284" /><Metric label="Delivered" value="824" /><Metric label="In progress" value="360" /></div>
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"><div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row"><div><h2 className="font-bold text-slate-900">Order directory</h2><p className="mt-1 text-sm text-slate-500">Sample orders for layout preview</p></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-400" /></div><select value={status} onChange={e => setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option>All</option>{["Delivered","Preparing","Pending","Cancelled"].map(s => <option key={s}>{s}</option>)}</select></div></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead className="bg-slate-50 text-xs text-slate-400"><tr>{["Order ID","Customer","Restaurant","Date","Amount","Status"].map(x => <th key={x} className="px-5 py-4">{x}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filtered.map(o => <tr key={o.id} className="hover:bg-orange-50/30"><td className="px-5 py-4 font-bold text-orange-600">#{o.id}</td><td className="px-5 py-4 text-sm">{o.customer}</td><td className="px-5 py-4 text-sm">{o.restaurant}</td><td className="px-5 py-4 text-sm text-slate-500">{o.date}</td><td className="px-5 py-4 text-sm font-bold">{money(o.amount)}</td><td className="px-5 py-4"><StatusBadge status={o.status} /></td></tr>)}{filtered.length === 0 && <tr><td colSpan="6" className="px-5 py-12 text-center text-sm text-slate-500"><ShoppingBag className="mx-auto mb-2 text-slate-300" />No orders found</td></tr>}</tbody></table></div></section>
  </>;
}
function Metric({ label, value }) { return <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p></div>; }
