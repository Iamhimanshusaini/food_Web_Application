import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock,CheckCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "./Login";
import axios from "axios"
import API from "../api/api"
import Loader from "../components/Loader"

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)

  const [alertMsg, setAlertMsg] = useState('')
  const notify = (text) => {
    setAlertMsg(text);
    setTimeout(() => setMessage(""), 2500);
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    notify('')
    setLoading(true)
    try {
      const res = await axios.post(`${API}/signup`, formData)
      if (res.data.success) {
        notify(res.data.message)
      }

      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`)
      notify(res.data.message)

    } catch (error) {
      notify(error.response?.data?.message)
      console.log(error.response?.data?.message)
      console.log(error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Foodly and start ordering delicious food."
    >
      <form onSubmit={onSubmitHandle} className="auth-form">
        <label
          className="text-red">
          Full name
          <input

            name="name"
            required
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
          />
          <User />
        </label>

        <label>
          Email
          <input
            name="email"
            required
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          <Mail />
        </label>

        <label>
          Phone
          <input
            name="phone"
            required
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={handleChange}
          />
          <Phone />
        </label>

        <label>
          Password
          <input
            name="password"
            required
            minLength={6}
            type="password"
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
          />
          <Lock />
        </label>

        <label className="check">
          <input required type="checkbox" />
          I agree to the Terms & Conditions
        </label>
        {alertMsg && (
          <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white shadow-xl">
            <CheckCircle size={18} className="text-emerald-400" />
            {alertMsg}
          </div>
        )}
        <button type="submit" className="primary-btn full">
          {loading ? (
            <Loader />
          ) : (
            "Create account"
          )

          }

        </button>

        <p className="auth-bottom">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}