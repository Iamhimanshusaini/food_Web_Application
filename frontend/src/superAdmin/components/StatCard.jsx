import { TrendingDown, TrendingUp } from "lucide-react";

export default function StatCard({ title, value, change, positive = true, icon: Icon, iconColor = "text-orange-500", iconBg = "bg-orange-50" }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
        </div>
        <div className={`rounded-xl p-3 ${iconBg} ${iconColor}`}><Icon size={21} /></div>
      </div>
      {change && <div className="mt-4 flex items-center gap-2 text-xs">
        <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-semibold ${positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{change}
        </span>
        <span className="text-slate-400">vs last month</span>
      </div>}
    </div>
  );
}
