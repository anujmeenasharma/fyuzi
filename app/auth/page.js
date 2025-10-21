"use client";
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LiquidEther from "@/components/LiquidEther";
import { authService } from "@/lib/authService"; // ⭐ ADDED

const AuthForm = () => {
    const router = useRouter();
    const [mode, setMode] = useState("login");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
    });
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [errors, setErrors] = useState({});
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formRef = useRef(null);
    const containerRef = useRef(null);
    const otpInputsRef = useRef([]);

    const SUPABASE_URL = "https://iwoihtzagjtmrsihfwfv.supabase.co";
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    useGSAP(() => {
        gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 50, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
        );

        gsap.fromTo(
            ".form-input",
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.3 }
        );
    }, [mode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validatePasswordStrength = (password) => {
        const errors = [];
        if (password.length < 8) errors.push("At least 8 characters");
        if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
        if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
        if (!/\d/.test(password)) errors.push("One number");
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("One special character");
        return { isValid: errors.length === 0, errors };
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (mode === "signup") {
            if (!formData.name.trim()) {
                newErrors.name = "Full name is required";
            } else if (formData.name.trim().length < 2) {
                newErrors.name = "Name must be at least 2 characters long";
            }

            const passwordStrength = validatePasswordStrength(formData.password);
            if (!passwordStrength.isValid) {
                newErrors.password = `Password must contain: ${passwordStrength.errors.join(", ")}`;
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password";
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        } else {
            if (!formData.password) {
                newErrors.password = "Password is required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsFormLoading(true);
        setErrors({});

        try {
            if (mode === "login") {
                const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": SUPABASE_ANON_KEY,
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error_description || data.msg || "Login failed");
                }

                // ⭐ SAVE TOKENS
                authService.setTokens(data);

                console.log("Login successful:", data);
                router.push("/chat"); // ⭐ CHANGED from "/" to "/chat"
            } else {
                const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": SUPABASE_ANON_KEY,
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        data: { name: formData.name.trim() },
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error_description || data.msg || "Signup failed");
                }

                console.log("Signup successful:", data);
                setMode("verify");
                setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
            }
        } catch (error) {
            setErrors({ general: error.message || "An error occurred. Please try again." });
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value.slice(-1);
            setOtp(newOtp);
            if (value && index < 5) {
                otpInputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpInputsRef.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpValue = otp.join("");

        if (otpValue.length !== 6) {
            setErrors({ general: "Please enter a 6-digit OTP" });
            return;
        }

        setIsFormLoading(true);
        setErrors({});

        try {
            const response = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({
                    email: formData.email,
                    token: otpValue,
                    type: "signup",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error_description || data.msg || "Verification failed");
            }

            // ⭐ SAVE TOKENS AFTER VERIFICATION
            authService.setTokens(data);

            console.log("Verification successful:", data);
            router.push("/chat"); // ⭐ CHANGED from "/" to "/chat"
        } catch (error) {
            setErrors({ general: error.message || "Invalid OTP. Please try again." });
            setOtp(Array(6).fill(""));
            otpInputsRef.current[0]?.focus();
        } finally {
            setIsFormLoading(false);
        }
    };

    const switchMode = () => {
        const newMode = mode === "login" ? "signup" : "login";
        setMode(newMode);
        setFormData({ email: formData.email, password: "", confirmPassword: "", name: "" });
        setErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    // Rest of the component remains the same...
    // (All the JSX code stays exactly as it was)
    
    if (mode === "verify") {
        return (
            <div className="h-screen overflow-hidden flex w-full relative">
                <div className="fixed inset-0 w-full h-full -z-10 text-white">
                    <LiquidEther
                        colors={["#ee4f20", "#ff6b3a", "#ee4f20"]}
                        autoDemo={true}
                        autoSpeed={0.3}
                        autoIntensity={1.5}
                        mouseForce={15}
                        cursorSize={400}
                    />
                </div>

                <div className="w-2/5 relative hidden lg:block text-white bg-orange-400/10">
                    <div className="fixed h-full w-full background"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col">
                        <Image className="invert" width={44} height={44} src="/MONOGRAM.svg" alt="logo" />
                        <h3 className="text-xl font-semibold text-nowrap">Welcome to the future of influence</h3>
                    </div>
                </div>

                <div className="w-full lg:w-3/5 flex items-center justify-center p-8 relative">
                    <div ref={containerRef} className="relative z-10 w-full max-w-md">
                        <div className="text-center mb-6 lg:mb-8">
                            <h1 className="text-2xl lg:text-3xl font-bebas text-white">Verify Your Email</h1>
                            <p className="text-gray-200 text-xs lg:text-sm mt-2">
                                Enter the 6-digit code sent to{" "}
                                <span className="text-[#EE4F20] font-medium">{formData.email}</span>
                            </p>
                        </div>

                        <div className="flex justify-between gap-2 mb-6">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    ref={(el) => (otpInputsRef.current[idx] = el)}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                    className="w-12 h-14 text-center rounded-xl border-2 border-gray-400 bg-gray-100 text-black text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#EE4F20] focus:border-[#EE4F20] transition-all"
                                    autoFocus={idx === 0}
                                />
                            ))}
                        </div>

                        {errors.general && (
                            <div className="mb-4 py-2 px-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-xs">{errors.general}</p>
                            </div>
                        )}

                        <button
                            onClick={handleVerify}
                            disabled={isFormLoading}
                            className="w-full bg-[#EE4F20] text-white py-[10px] text-xs md:text-sm lg:text-base lg:py-3 px-4 rounded-lg font-semibold hover:bg-[#EE4F20]/90 focus:outline-none focus:ring-2 focus:ring-[#EE4F20] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isFormLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    Verifying...
                                </div>
                            ) : (
                                "Verify OTP"
                            )}
                        </button>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => {
                                    setMode("signup");
                                    setOtp(Array(6).fill(""));
                                    setErrors({});
                                }}
                                className="text-gray-200 hover:text-white text-xs lg:text-sm transition-colors"
                            >
                                Back to signup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-hidden flex w-full relative">
            <div className="fixed inset-0 w-full h-full -z-10 text-white">
                <LiquidEther
                    colors={["#ee4f20", "#ff6b3a", "#ee4f20"]}
                    autoDemo={true}
                    autoSpeed={0.3}
                    autoIntensity={1.5}
                    mouseForce={15}
                    cursorSize={400}
                />
            </div>

            <div className="w-2/5 relative hidden lg:block text-white bg-orange-400/10">
                <div className="fixed h-full w-full background"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col">
                    <Image className="invert" width={44} height={44} src="/MONOGRAM.svg" alt="logo" />
                    <h3 className="text-xl font-semibold text-nowrap">Welcome to the future of influence</h3>
                </div>
            </div>

            <div className="w-full lg:w-3/5 flex items-center justify-center p-8 relative">
                <div ref={containerRef} className="relative z-10 w-full max-w-md">
                    <div className="text-center mb-6 lg:mb-8">
                        <h1 className="text-2xl lg:text-3xl font-bebas text-white">
                            {mode === "login" ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-gray-200 text-xs lg:text-sm mt-2">
                            {mode === "login"
                                ? "Sign in to your account to continue"
                                : "Join us and start customizing your threads"}
                        </p>
                    </div>

                    <div onSubmit={handleSubmit} className="space-y-4 auth-form">
                        {mode === "signup" && (
                            <div className="form-input flex flex-col">
                                <label className="text-white text-xs lg:text-sm font-medium mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full text-xs md:text-sm lg:text-base px-4 py-[10px] lg:py-3 bg-gray-100 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#EE4F20] transition-all duration-300 ${
                                        errors.name ? "border-red-500" : "border-gray-400"
                                    }`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>
                        )}

                        <div className="form-input flex flex-col">
                            <label className="text-white text-xs lg:text-sm font-medium mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-[10px] lg:py-3 text-xs lg:text-base bg-gray-100 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#EE4F20] transition-all duration-300 ${
                                    errors.email ? "border-red-500" : "border-gray-400"
                                }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="form-input flex flex-col">
                            <label className="text-white text-xs lg:text-sm font-medium mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 text-xs md:text-sm lg:text-base py-[10px] lg:py-3 bg-gray-100 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#EE4F20] transition-all duration-300 pr-12 ${
                                        errors.password ? "border-red-500" : "border-gray-400"
                                    }`}
                                    placeholder={mode === "login" ? "Enter your password" : "Create a strong password"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-xs cursor-pointer"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                            {mode === "signup" && formData.password && !errors.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 flex-wrap">
                                        {[
                                            { test: formData.password.length >= 8, label: "8+ chars" },
                                            { test: /[A-Z]/.test(formData.password), label: "Uppercase" },
                                            { test: /[a-z]/.test(formData.password), label: "Lowercase" },
                                            { test: /\d/.test(formData.password), label: "Number" },
                                            { test: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password), label: "Special" },
                                        ].map((requirement, index) => (
                                            <span
                                                key={index}
                                                className={`text-xs px-2 py-1 rounded ${
                                                    requirement.test
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-white/90"
                                                }`}
                                            >
                                                {requirement.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {mode === "signup" && (
                            <div className="form-input flex flex-col">
                                <label className="text-white text-xs lg:text-sm font-medium mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 text-xs md:text-sm lg:text-base py-[10px] lg:py-3 bg-gray-100 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#EE4F20] transition-all duration-300 pr-12 ${
                                            errors.confirmPassword ? "border-red-500" : "border-gray-400"
                                        }`}
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/90 text-xs cursor-pointer"
                                    >
                                        {showConfirmPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                                )}
                                {formData.confirmPassword &&
                                    !errors.confirmPassword &&
                                    formData.password === formData.confirmPassword && (
                                        <p className="text-green-600 text-xs mt-1">✓ Passwords match</p>
                                    )}
                            </div>
                        )}

                        {errors.general && (
                            <div className="py-2 px-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-xs">{errors.general}</p>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={isFormLoading}
                            className="w-full bg-[#EE4F20] text-white py-[10px] text-xs md:text-sm lg:text-base lg:py-3 px-4 rounded-lg font-semibold hover:bg-[#EE4F20]/90 focus:outline-none focus:ring-2 focus:ring-[#EE4F20] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isFormLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    {mode === "login" ? "Signing in..." : "Creating account..."}
                                </div>
                            ) : mode === "login" ? (
                                "Sign In"
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-200 text-xs lg:text-sm">
                            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={switchMode}
                                className="ml-1 text-[#EE4F20] hover:text-[#EE4F20]/80 font-medium transition-colors cursor-pointer"
                            >
                                {mode === "login" ? "Sign up" : "Sign in"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-8 text-center w-fit right-8">
                <button 
                    onClick={() => router.push('/')}
                    className="text-gray-200 hover:text-white text-sm underline transition-colors cursor-pointer"
                >
                    Continue without login
                </button>
            </div>
        </div>
    );
};

export default AuthForm;