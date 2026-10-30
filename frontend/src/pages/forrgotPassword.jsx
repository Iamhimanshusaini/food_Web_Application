
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, UtensilsCrossed, ShieldCheck } from "lucide-react";
import axios from "axios";
import API from "../api/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const { data } = await axios.post(
                `${API}/forgot-password`,
                { email }
            );

            setMessage(data.message || "Reset OTP sent to your email.");

            // OTP page ka route apne project ke according adjust karna
            navigate(
                `/verify-otp?email=${encodeURIComponent(email)}`
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to send reset OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50/60 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center justify-center gap-2 mb-8"
                >
                    <div className="bg-orange-500 text-white p-3 rounded-2xl">
                        <UtensilsCrossed size={28} />
                    </div>
                    <span className="text-3xl font-extrabold text-gray-900">
                        Food<span className="text-orange-500">ly</span>
                    </span>
                </Link>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/70 border border-orange-100 p-7 sm:p-9">

                    <div className="mx-auto mb-5 flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-orange-600">
                        <ShieldCheck size={32} />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
                        Forgot Password?
                    </h1>

                    <p className="text-gray-500 text-center text-sm leading-6 mt-3 mb-8">
                        No worries! Enter your registered email address
                        and we’ll help you reset your password.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>

                            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100 transition">
                                <Mail size={19} className="text-gray-400 shrink-0" />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full py-3.5 outline-none text-gray-800 bg-transparent"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {message && (
                            <p role="status" className="text-sm text-green-700 bg-green-50 p-3 rounded-xl">
                                {message}
                            </p>
                        )}

                        {error && (
                            <p role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
                        >
                            {loading ? "Sending OTP..." : "Send Reset OTP"}
                        </button>

                    </form>

                    <div className="mt-7 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition"
                        >
                            <ArrowLeft size={17} />
                            Back to Login
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Secure account recovery · Foodly
                </p>

            </div>
        </div>
    );
}
