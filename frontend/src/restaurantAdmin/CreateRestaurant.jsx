import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Store, MapPin, Phone, Mail, Utensils } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";

export default function CreateRestaurant() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    cuisine: "",
    image: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first.");
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `${API}/create-restaurant`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setMessage(res.data.message);

        // Updated role + restaurant ID AuthContext mein save karo
        const updatedUser = res.data.user;

        login(updatedUser, token);
        
        logout()
        setTimeout(() => {
          navigate("/rs-admin", { replace: true });
        }, 1000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Restaurant create nahi ho paya."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-orange-50 p-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <h2 className="text-xl font-bold">Login required</h2>
          <p className="mt-2 text-gray-500">
            Restaurant create karne ke liye login karo.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <Store size={30} />
          </div>

          <h1 className="text-3xl font-bold">Create your restaurant</h1>
          <p className="mt-2 text-orange-50">
            Add your restaurant details to get started with Foodly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6 md:p-8">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
              {message}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Restaurant name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Food Corner"
              icon={<Store size={18} />}
            />

            <FormField
              label="Contact phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Restaurant phone"
              icon={<Phone size={18} />}
            />

            <FormField
              label="Restaurant email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="restaurant@example.com"
              icon={<Mail size={18} />}
            />

            <FormField
              label="Cuisine type"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              placeholder="Indian, Chinese, Pizza..."
              icon={<Utensils size={18} />}
            />
          </div>

          <FormField
            label="Full address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street, city, state, PIN code"
            icon={<MapPin size={18} />}
          />

          <FormField
            label="Restaurant image URL (optional)"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/restaurant.jpg"
            icon={<Store size={18} />}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-4 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating restaurant..." : "Create Restaurant"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Your restaurant may require admin approval before going live.
          </p>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </span>

      <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
        <span className="text-gray-400">{icon}</span>
        <input
          className="w-full bg-transparent py-3 outline-none"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={
            !["image"].includes(name)
          }
        />
      </div>
    </label>
  );
}