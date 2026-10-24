import { useState } from "react";
import { Star, Search } from "lucide-react";
import PageHeading from "../components/PageHeading";
import { demoReviews } from "../data/demoData";

export default function Reviews() {
  const [search, setSearch] = useState("");
  const reviews = demoReviews.filter(r => `${r.customer} ${r.restaurant} ${r.comment}`.toLowerCase().includes(search.toLowerCase()));
  return <>
    <PageHeading title="Reviews" description="Read customer feedback about restaurants and orders." />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Metric label="Total reviews (demo)" value="1,824" /><Metric label="Average rating" value="4.6 / 5" /><Metric label="Needs attention" value="24" /></div>
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="font-bold text-slate-900">Recent customer feedback</h2><p className="mt-1 text-sm text-slate-500">Sample reviews for preview</p></div><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..." className="rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-400" /></div></div><div className="space-y-4">{reviews.map(r => <article key={r.id} className="rounded-xl border border-slate-100 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-slate-800">{r.customer}</p><p className="mt-1 text-sm text-slate-500">{r.restaurant} · {r.date}</p></div><div className="flex items-center gap-1 text-amber-500">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={15} className={i < r.rating ? "fill-amber-400" : "text-slate-200"} />)}<span className="ml-1 text-sm font-bold text-slate-700">{r.rating}.0</span></div></div><p className="mt-3 text-sm leading-6 text-slate-600">{r.comment}</p></article>)}{reviews.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No reviews found.</p>}</div></section>
  </>;
}
function Metric({ label, value }) { return <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p></div>; }
