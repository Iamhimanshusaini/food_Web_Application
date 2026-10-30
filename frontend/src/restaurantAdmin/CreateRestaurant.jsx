
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Utensils,
  ImagePlus,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import API from "../api/api";

export default function CreateRestaurant() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    cuisine: "",
  });

  // Cleanup image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");

    const input = document.getElementById("restaurant-image");

    if (input) {
      input.value = "";
    }
  };

  // Submit restaurant details + image together
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

      if (!imageFile) {
        setError("Please select a restaurant image.");
        return;
      }

      // FormData contains text fields and the image file
      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("phone", formData.phone.trim());
      data.append("email", formData.email.trim());
      data.append("address", formData.address.trim());
      data.append("cuisine", formData.cuisine.trim());
      data.append("image", imageFile);

      // One API call only
      const res = await axios.post(
        `${API}/create-restaurant`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setMessage(
          res.data.message || "Restaurant created successfully!"
        );

        // Update user only if backend returns updated user data
        if (res.data.user) {
          login(res.data.user, token);
        }

        setTimeout(() => {
          navigate("/rs-admin", { replace: true });
        }, 1000);
      } else {
        setError(
          res.data.message || "Restaurant create nahi ho paya."
        );
      }
    } catch (err) {
      console.error(
        "Create restaurant error:",
        err.response?.data || err
      );

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
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <Store
            size={42}
            className="mx-auto text-orange-500"
          />

          <h2 className="mt-4 text-xl font-bold">
            Login required
          </h2>

          <p className="mt-2 text-gray-500">
            Restaurant create karne ke liye login karo.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
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

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <Store size={30} />
          </div>

          <h1 className="text-3xl font-bold">
            Create your restaurant
          </h1>

          <p className="mt-2 text-orange-50">
            Add your restaurant details to get started with Foodly.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6 md:p-8"
        >
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

          {/* Address */}
          <FormField
            label="Full address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street, city, state, PIN code"
            icon={<MapPin size={18} />}
          />

          {/* Image Upload */}
          <div>
            <label
              htmlFor="restaurant-image"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Restaurant Image
            </label>

            {!imagePreview ? (
              <label
                htmlFor="restaurant-image"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/50 px-5 py-10 text-center transition hover:bg-orange-50"
              >
                <ImagePlus
                  size={40}
                  className="mb-3 text-orange-500"
                />

                <span className="font-semibold text-gray-700">
                  Click to upload restaurant image
                </span>

                <span className="mt-2 text-sm text-gray-500">
                  JPG, PNG, WEBP · Maximum 5 MB
                </span>
              </label>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-gray-200">
                <img
                  src={imagePreview}
                  alt="Restaurant preview"
                  className="h-64 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-500 shadow hover:bg-red-50"
                  aria-label="Remove image"
                >
                  <X size={20} />
                </button>

                <div className="bg-white p-3">
                  <p className="truncate text-sm font-medium text-gray-700">
                    {imageFile?.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {imageFile
                      ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB`
                      : ""}
                  </p>
                </div>
              </div>
            )}

            <input
              id="restaurant-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-4 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating restaurant..."
              : "Create Restaurant"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Your restaurant may require admin approval before going live.
          </p>
        </form>
      </div>
    </div>
  );
}

// Reusable form field
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
          required
        />
      </div>
    </label>
  );
}
