import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import API from "../api/api"
import Loader from "../components/Loader"
export default function Login() {
  const { login, user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false);
  const [alertMsg, setAlertMsg] = useState('')

  const notify = (text) => {
    setAlertMsg(text);
    setTimeout(() => setMessage(""), 2500);
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChnage = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await axios.post(`${API}/login`, formData)
      console.log(res)
      notify(res.data.message)
      if (res.data.success) {

        login(res.data.customerUser, res.data.token)
      }
      console.log(res.data.customerUser)
      if (res.data.customerUser.role === "restaurantOwner") {
        return navigate('/rs-admin')

      }
      if (res.data.customerUser.role === "super-admin") {
        return navigate('/super-admin')
      }
      navigate('/')

    } catch (error) {
      notify(error.response?.data?.message || "Something went wrong");
      console.log(error.response?.data?.message)
    } finally {
      setLoading(false)
    }

  };

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Login to continue ordering your favorite food."
    >
      <form onSubmit={submit} className="auth-form">
        <label>
          Email
          <input
            name="email"
            required
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChnage}
          />
          <Mail />
        </label>

        <label>
          Password
          <div className="password-input">
            <input
              name="password"
              required
              type={show ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChnage
              }
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </label>

        <div className="forgot">
          <label className="check">
            <input type="checkbox" />
            Remember me
          </label>

          <Link to="/forgot">Forgot password?</Link>
        </div>
        {alertMsg && (
          <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white shadow-xl">
            <CheckCircle size={18} className="text-emerald-400" />
            {alertMsg}
          </div>
        )}
        <button type="submit" className="primary-btn full">
          {
            loading === true ? (
              <Loader />
            ) : (
              "Login"
            )
          }
        </button>

        <p className="auth-bottom">
          Don't have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div>
          <span className="brand white">
            <span className="brand-icon">🍔</span> Foodly
          </span>

          <h1>
            Good food is
            <br />
            <span>always a good idea.</span>
          </h1>

          <p>
            Discover delicious meals from the best restaurants
            around you.
          </p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-box">
          <span className="eyebrow">FOODLY</span>

          <h2>{title}</h2>

          <p>{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  );
}