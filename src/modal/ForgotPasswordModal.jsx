import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { forgotSendOtp, forgotVerifyOtp, resetPassword } from "../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordModal({ onClose }) {
    const [step, setStep] = useState("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const firstInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => firstInputRef.current?.focus(), 100);
    }, [step]);

    useEffect(() => {
        let id;
        if (resendTimer > 0) {
            id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
        }
        return () => clearTimeout(id);
    }, [resendTimer]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const startResendTimer = () => setResendTimer(30);

    const handleSendOtp = async () => {
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            toast.error("Please enter a valid email");
            return;
        }
        setLoading(true);
        try {
            await forgotSendOtp({ email });
            toast.success("OTP sent to your email");
            setStep("otp");
            startResendTimer();
        } catch (err) {
            toast.error(err?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error("Enter the OTP");
            return;
        }
        setLoading(true);
        try {
            const res = await forgotVerifyOtp({ email, code: otp });
            setToken(res?.data?.token || "");
            toast.success("OTP verified");
            setStep("reset");
        } catch (err) {
            toast.error(err?.message || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!password || password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            await resetPassword({ email, token, password, password_confirmation: confirmPassword });
            toast.success("Password has been reset");
            navigate("/login");
        } catch (err) {
            toast.error(err?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose?.();
    };

    const resendOtp = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        try {
            await forgotSendOtp({ email });
            toast.success("OTP resent");
            startResendTimer();
        } catch (err) {
            toast.error(err?.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    const onKeyDownSubmit = (e) => {
        if (e.key === "Enter") {
            if (step === "email") handleSendOtp();
            else if (step === "otp") handleVerifyOtp();
            else if (step === "reset") handleResetPassword();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onMouseDown={handleBackdropClick}
            aria-modal="true"
            role="dialog"
            aria-label="Forgot password dialog"
        >
            <div
                className="bg-white rounded-md shadow-md w-full max-w-lg mx-4 md:mx-0 p-6 md:p-8 relative max-h-[60vh] overflow-y-auto"
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={() => {
                        if (onClose) onClose();
                        else navigate(-1);
                    }}
                    aria-label="Close"
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-md"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-none bg-teal-50 rounded-full w-10 h-10 grid place-items-center text-teal-600 font-bold">
                        🔒
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Forgot Password</h3>
                        <p className="text-sm text-gray-500">Follow the steps to reset your account password</p>
                    </div>
                </div>

                {/* Body */}
                <div onKeyDown={onKeyDownSubmit}>
                    {step === "email" && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                ref={firstInputRef}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full border form-input rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-200"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                    className="flex-1 bg-teal-500 text-white py-2 rounded-lg disabled:opacity-60 text-xs"
                                >
                                    {loading ? "Sending..." : "Send one-time passcode"}
                                </button>
                                <button
                                    onClick={() => {
                                        if (onClose) onClose();
                                        else navigate(-1);
                                    }}
                                    className="flex-1 border rounded-lg py-2 text-xs"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "otp" && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">OTP</label>
                            <input
                                ref={firstInputRef}
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit code"
                                className="w-full border form-input rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-200"
                            />

                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <div>Didn't receive it?</div>
                                <button
                                    onClick={resendOtp}
                                    disabled={resendTimer > 0 || loading}
                                    className="underline text-sm disabled:opacity-50"
                                >
                                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={loading}
                                    className="flex-1 bg-teal-500 text-white py-2 rounded-lg disabled:opacity-60 text-xs"
                                >
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </button>
                                <button
                                    onClick={() => setStep('email')}
                                    className="flex-1 border rounded-lg py-2 text-xs"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "reset" && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">New password</label>
                            <div className="relative">
                                <input
                                    ref={firstInputRef}
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    className="w-full border form-input rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-200"
                                />
                            </div>

                            <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                                className="w-full form-input border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-200"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={handleResetPassword}
                                    disabled={loading}
                                    className="flex-1 bg-teal-500 text-white py-2 rounded-lg disabled:opacity-60 text-xs"
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>

                                <button
                                    onClick={() => setStep('otp')}
                                    className="flex-1 border rounded-lg py-2 text-xs"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer small note */}
                <div className="mt-5 text-xs text-gray-400 text-center">We will never share your email with anyone.</div>
            </div>
        </div>
    );
}
