import { useState } from "react";
import { Save, ShieldCheck, Bell, UserRound } from "lucide-react";
import PageHeading from "../components/PageHeading";
import Toast from "../components/Toast";

export default function Settings() {
  const [form, setForm] = useState({ name: "Admin User", email: "admin@foodly.com", notifications: true, approvalAlerts: true });
  const [toast, setToast] = useState("");
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const save = (e) => { e.preventDefault(); setToast("Settings saved in this page session."); };
  return <>
    <PageHeading title="Settings" description="Manage your Super Admin profile and notification preferences." />
    <form onSubmit={save} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-2"><div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-orange-50 p-3 text-orange-600"><UserRound size={21} /></div><div><h2 className="font-bold text-slate-900">Admin profile</h2><p className="text-sm text-slate-500">Basic account information</p></div></div>
        <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Full name<input value={form.name} onChange={e => update("name", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-orange-400" /></label><label className="text-sm font-semibold text-slate-700">Email address<input type="email" value={form.email} onChange={e => update("email", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-orange-400" /></label></div>
        <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-6"><div className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><ShieldCheck size={21} /></div><div><h3 className="font-bold text-slate-900">Administrator access</h3><p className="text-sm text-slate-500">Super Admin · Full platform access</p></div></div>
      </section>
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"><div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Bell size={21} /></div><div><h2 className="font-bold text-slate-900">Notifications</h2><p className="text-sm text-slate-500">Choose what you receive</p></div></div>
        <Toggle title="Platform notifications" description="General admin alerts" checked={form.notifications} onChange={v => update("notifications", v)} /><div className="my-5 border-t border-slate-100" /><Toggle title="Restaurant approvals" description="New application alerts" checked={form.approvalAlerts} onChange={v => update("approvalAlerts", v)} />
      </section>
      <div className="xl:col-span-3"><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-100 hover:bg-orange-600"><Save size={17} />Save settings</button></div>
    </form>
    <Toast message={toast} onClose={() => setToast("")} />
  </>;
}
function Toggle({ title, description, checked, onChange }) { return <label className="flex cursor-pointer items-center justify-between gap-4"><span><span className="block text-sm font-semibold text-slate-800">{title}</span><span className="mt-1 block text-xs text-slate-500">{description}</span></span><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="h-5 w-5 accent-orange-500" /></label>; }
