"use client";
import React, { useState, useRef, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1); // only one digit
      setOtp(newOtp);

      // focus next input
      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://iwoihtzagjtmrsihfwfv.supabase.co/auth/v1/verify",
        {
          email,
          token: otpValue,
          type: "signup", // verify signup
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
        }
      );

      console.log("Verification success:", response.data);
      router.push("/"); // redirect after success
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.msg ||
          err.response?.data?.error_description ||
          "Invalid OTP. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#130a03] to-[#ff5e00]/10 text-white relative">
      <div className="absolute inset-0 bg-gradient-to-tl from-orange-500/20 via-transparent to-transparent blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md px-8 py-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Verify your email
        </h1>

        <p className="text-gray-300 text-center mb-6">
          Enter the 6-digit code sent to <span className="text-orange-400">{email}</span>
        </p>

        <form className="flex justify-between gap-2 mb-4" onSubmit={handleSubmit}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => (inputsRef.current[idx] = el)}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="w-12 h-12 text-center rounded-lg border border-white/20 bg-transparent text-white text-xl focus:outline-none focus:border-orange-500 transition"
            />
          ))}
        </form>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#130a03] to-[#ff5e00]/10 text-white">
          Loading...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
