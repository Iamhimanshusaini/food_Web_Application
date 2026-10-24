import { useState } from "react";
import { Search, Users } from "lucide-react";
import PageHeading from "../components/PageHeading";
import StatusBadge from "../components/StatusBadge";
import { demoCustomers } from "../data/demoData";

export default function Customers() {
  const [search, setSearch] = useState("");
  const filtered = demoCustomers.filter(c => `${c.name} ${c.email} ${c.id}`.toLowerCase().includes(search.toLowerCase()));
  return <>
    <PageHeading title="Customers" description="View customer accounts and their Foodly activity." />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Metric label="Total customers (demo)" value="8,549" /><Metric label="Active customers" value="8,120" /><Metric label="New this month" value="429" /></div>
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"><div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center"><div><h2 className="font-bold text-slate-900">Customer directory</h2><p className="mt-1 text-sm text-slate-500">Sample customer records</p></div><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-400 sm:w-64" /></div></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead className="bg-slate-50 text-xs text-slate-400"><tr>{["Customer","Email","Phone","Orders","Status"].map(x => <th key={x} className="px-5 py-4">{x}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filtered.map(c => <tr key={c.id} className="hover:bg-orange-50/30"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">{c.name.split(" ").map(n => n[0]).join("")}</div><div><p className="text-sm font-semibold text-slate-800">{c.name}</p><p className="text-xs text-slate-400">{c.id}</p></div></div></td><td className="px-5 py-4 text-sm text-slate-600">{c.email}</td><td className="px-5 py-4 text-sm text-slate-600">{c.phone}</td><td className="px-5 py-4 text-sm font-semibold">{c.orders}</td><td className="px-5 py-4"><StatusBadge status={c.status} /></td></tr>)}{filtered.length === 0 && <tr><td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-500"><Users className="mx-auto mb-2 text-slate-300" />No customers found</td></tr>}</tbody></table></div></section>
  </>;
}
function Metric({ label, value }) { return <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p></div>; }
