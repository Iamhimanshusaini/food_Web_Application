import { Link } from "react-router-dom";
import { UserRound, MapPin, Phone, Mail, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  if (!user) return <div className="empty-page"><div className="empty-icon">👤</div><h1>Login required</h1><Link className="primary-btn" to="/login">Login</Link></div>;
  return <div className="container page narrow-page"><div className="page-heading"><span className="eyebrow">ACCOUNT</span><h1>My profile</h1></div><div className="profile-card"><div className="profile-top"><div className="big-avatar">{user.name?.charAt(0).toUpperCase()}</div><div><h2>{user.name}</h2><p>Foodly customer</p></div></div><div className="profile-details"><div><Mail /> <span>{user.email}</span></div><div><Phone /> <span>{user.phone || "Add phone number"}</span></div><div><MapPin /> <span>Manage your delivery addresses</span><ChevronRight /></div></div><button className="logout-full" onClick={logout}><LogOut /> Logout</button></div></div>;
}