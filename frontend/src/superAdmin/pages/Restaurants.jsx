import { useState } from "react";
import PageHeading from "../components/PageHeading";
import RestaurantTable from "../components/RestaurantTable";
import RestaurantDetailsModal from "../components/RestaurantDetailsModal";
import Toast from "../components/Toast";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function Restaurants() {
  const { restaurants, updateRestaurantStatus } = useSuperAdmin();
  const [selected, setSelected] = useState(null);
  const [notification, setNotification] = useState("");
  const update = (id, status) => { updateRestaurantStatus(id, status); setSelected(null); setNotification(`Restaurant ${status.toLowerCase()} successfully.`); };
  return <>
    <PageHeading title="Restaurants" description="View, search and manage all restaurants registered on Foodly." />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Metric label="Total restaurants" value={restaurants.length} /><Metric label="Approved" value={restaurants.filter(r => r.status === "Approved").length} /><Metric label="Pending review" value={restaurants.filter(r => r.status === "Pending").length} /></div>
    <RestaurantTable restaurants={restaurants} onStatusChange={update} onView={setSelected} />
    <RestaurantDetailsModal restaurant={selected} onClose={() => setSelected(null)} onStatusChange={update} />
    <Toast message={notification} onClose={() => setNotification("")} />
  </>;
}
function Metric({ label, value }) { return <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p></div>; }
