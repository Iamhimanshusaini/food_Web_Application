
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ShieldCheck } from "lucide-react";
import { AuthLayout } from "./Login";
import axios from "axios";
import Loader from "../components/Loader"

import API from "../api/api"

import { useSearchParams } from "react-router-dom";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

  const [fillOtp, setFillOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  console.log(fillOtp, email)
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError("");
    setSuccess("");

    if (!email) {
      setError("Signup session not found. Please register again.");
      return;
    }



    try {

      const res = await axios.post(`${API}/otp-verify`, {
        email,
        fillOtp
      })

      setSuccess(res.data.message);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (error) {
      console.log(error.response?.data?.message)
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <AuthLayout
        title="Verification required"
        subtitle="Please register first to receive your OTP."
      >
        <Link className="primary-btn full" to="/register">
          Go to Register
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit OTP sent to your email address."
    >
      <form onSubmit={handleVerify} className="auth-form">
        <p>
          <Mail size={18} /> {email}
        </p>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {success && (
          <p className="success-message">{success}</p>
        )}

        <label>
          Email verification OTP

          <input
            required
            name="fillOtp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={fillOtp}
            onChange={(e) =>
              setFillOtp(e.target.value.replace(/\D/g, ""))
            }
          />

          <ShieldCheck />
        </label>

        <button
          type="submit"
          className="primary-btn full"
          disabled={loading || fillOtp.length !== 6}
        >
          {
            loading === true ? (
              <Loader />
            ) : (
              "Verify & Create Account"
            )
          }
        </button>

        <p className="auth-bottom">
          Wrong email?{" "}
          <Link to="/register">Register again</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
