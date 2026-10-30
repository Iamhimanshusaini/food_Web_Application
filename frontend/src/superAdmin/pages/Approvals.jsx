import { useState } from "react";
import { ClipboardList, Clock } from "lucide-react";
import PageHeading from "../components/PageHeading";
import RestaurantTable from "../components/RestaurantTable";
import RestaurantDetailsModal from "../components/RestaurantDetailsModal";
import Toast from "../components/Toast";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function Approvals() {
  const { restaurants, updateRestaurantStatus } = useSuperAdmin();

  const [selected, setSelected] = useState(null);
  const [notification, setNotification] = useState("");
  const pending = restaurants.filter(r => r.status === "Pending").length;
  const update = (id, status) => { updateRestaurantStatus(id, status); setSelected(null); setNotification(`Restaurant ${status.toLowerCase()} successfully.`); };
  return <>
    <PageHeading title="Restaurant Approvals" description="Review restaurant applications and approve or reject them." action={<div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700"><Clock size={17} />{pending} awaiting review</div>} />
    <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-5"><div className="flex items-start gap-3"><div className="rounded-xl bg-orange-100 p-3 text-orange-600"><ClipboardList size={22} /></div><div><h2 className="font-bold text-slate-900">Application review</h2><p className="mt-1 text-sm leading-6 text-slate-600">Check each restaurant's details before approving. These demo actions update the local UI only; connect your API for permanent changes.</p></div></div></div>
    <RestaurantTable restaurants={restaurants} approvalsOnly onStatusChange={update} onView={setSelected} />
    <RestaurantDetailsModal restaurant={selected} onClose={() => setSelected(null)} onStatusChange={update} />
    <Toast message={notification} onClose={() => setNotification("")} />
  </>;
}
