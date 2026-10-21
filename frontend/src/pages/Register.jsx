import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock } from "lucide-react";
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
    setAlertMsg('')
    setLoading(true)
    try {
      const res = await axios.post(`${API}/signup`, formData)
      if (res.data.success) {
        setAlertMsg(res.data.message)
      }
      localStorage.setItem("regiterEmail", formData.email);

      navigate('/verify-otp')
      setAlertMsg(res.data.message)

    } catch (error) {
      setAlertMsg(error.response?.data?.message)
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
          <p className="rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-200">
            {alertMsg}
          </p>
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