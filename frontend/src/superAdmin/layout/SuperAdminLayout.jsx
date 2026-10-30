import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import SuperAdminHeader from "../components/SuperAdminHeader";
import { SuperAdminProvider } from "../context/SuperAdminContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
function LayoutContent() {
  const navigate = useNavigate()

  const [mobileMenu, setMobileMenu] = useState(false);
  const { user } = useAuth()

  if (!user) {
    return (
      <AccessMessage
        title="Login required"
        description="Please log in to access Super Admin management."
        buttonText="Go to login"
        onClick={() => navigate("/Login")}
      />
    );
  }

  if (user.role === "super-admin") {
    return (
      <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
        <SuperAdminSidebar isOpen={mobileMenu} onClose={() => setMobileMenu(false)} />
        <div className="min-h-screen lg:ml-64">
          <SuperAdminHeader onMenuClick={() => setMobileMenu(true)} />
          <main className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-7 lg:p-9"><Outlet /></main>
        </div>
      </div>
    );
  } else {
    return (
      <AccessMessage
        title="You are not authorized to access "
        description="Please contact the administrator to get the required permission."
        buttonText="Go to login"
        onClick={() => navigate("/login")}
      />
    );
  }


}
function AccessMessage({ title, description, buttonText, onClick }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
        <ShieldAlert size={44} className="mx-auto text-orange-500" />
        <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {description}
        </p>
        <button
          onClick={onClick}
          className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}


export default function SuperAdminLayout() {
  return <SuperAdminProvider><LayoutContent /></SuperAdminProvider>;
}
