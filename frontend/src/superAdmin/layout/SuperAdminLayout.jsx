import { useState } from "react";
import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import SuperAdminHeader from "../components/SuperAdminHeader";
import { SuperAdminProvider } from "../context/SuperAdminContext";

function LayoutContent() {
  const [mobileMenu, setMobileMenu] = useState(false);
  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
      <SuperAdminSidebar isOpen={mobileMenu} onClose={() => setMobileMenu(false)} />
      <div className="min-h-screen lg:ml-64">
        <SuperAdminHeader onMenuClick={() => setMobileMenu(true)} />
        <main className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-7 lg:p-9"><Outlet /></main>
      </div>
    </div>
  );
}

export default function SuperAdminLayout() {
  return <SuperAdminProvider><LayoutContent /></SuperAdminProvider>;
}
