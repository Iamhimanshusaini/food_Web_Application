const statusStyles = {
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Preparing: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Rejected: "bg-red-50 text-red-700 ring-red-600/20",
  Cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  Inactive: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status] || statusStyles.Pending}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
