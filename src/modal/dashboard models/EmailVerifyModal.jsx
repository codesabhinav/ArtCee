import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { sendOtp, verifyOtp } from "../../Hooks/useAuth";
import toast from "react-hot-toast";
import { getGuestDashboardData } from "../../Hooks/useSeller";

const EmailVerifyModal = ({ isOpen, onClose, initialData = {}, onVerified }) => {
  const email = initialData.email || "";
  const OTP_LENGTH = 6;

  const [values, setValues] = useState(Array(OTP_LENGTH).fill(""));
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [error, setError] = useState(null);

  const RESEND_COOLDOWN = 30;
  const [cooldown, setCooldown] = useState(0);

  const inputsRef = useRef([]);
  inputsRef.current = inputsRef.current.slice(0, OTP_LENGTH);

  const code = values.join("");

  useEffect(() => {
    if (!isOpen) return;

    setValues(Array(OTP_LENGTH).fill(""));
    setError(null);
    setStatusMessage(null);
    setCooldown(0);

    const autoSend = async () => {
      setLoadingSend(true);
      setError(null);
      try {
        await sendOtp();
        setStatusMessage("OTP sent. Check your email.");
        setCooldown(RESEND_COOLDOWN);
      } catch (err) {
        setError(err?.message || "Failed to send OTP");
      } finally {
        setLoadingSend(false);
      }
    };

    autoSend();
  }, [isOpen]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(t);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleChange = (e, idx) => {
    const raw = e.target.value || "";
    const char = raw.replace(/\D/g, "").slice(0, 1);
    if (!char) return;
    const next = [...values];
    next[idx] = char;
    setValues(next);

    const nextIdx = idx + 1;
    if (nextIdx < OTP_LENGTH) {
      inputsRef.current[nextIdx]?.focus();
      inputsRef.current[nextIdx]?.select?.();
    }
  };

  const handleKeyDown = (e, idx) => {
    const key = e.key;

    if (key === "Backspace" || key === "Delete") {
      e.preventDefault();
      const next = [...values];
      if (next[idx]) {
        next[idx] = "";
        setValues(next);
        inputsRef.current[idx]?.focus();
      } else {
        const prev = idx - 1;
        if (prev >= 0) {
          next[prev] = "";
          setValues(next);
          inputsRef.current[prev]?.focus();
          inputsRef.current[prev]?.select?.();
        }
      }
      return;
    }

    if (key === "ArrowLeft") {
      e.preventDefault();
      const prev = Math.max(0, idx - 1);
      inputsRef.current[prev]?.focus();
      return;
    }
    if (key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = Math.min(OTP_LENGTH - 1, idx + 1);
      inputsRef.current[nextIdx]?.focus();
      return;
    }

    if (!/^[0-9]$/.test(key) && key.length === 1) {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData("text") || "";
    const digits = pasted.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    if (digits.length === 0) return;
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    setValues(next);
    const firstEmpty = digits.length < OTP_LENGTH ? digits.length : OTP_LENGTH - 1;
    inputsRef.current[firstEmpty]?.focus();
    inputsRef.current[firstEmpty]?.select?.();
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setLoadingSend(true);
    setError(null);
    setValues(Array(OTP_LENGTH).fill(""));
    try {
      await sendOtp();
      setStatusMessage("OTP resent. Check your email.");
      setCooldown(RESEND_COOLDOWN);
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } catch (err) {
      setError(err?.message || "Failed to resend OTP");
    } finally {
      setLoadingSend(false);
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault?.();
    setError(null);

    if (code.length !== OTP_LENGTH) {
      setError(`Enter ${OTP_LENGTH} digits`);
      return;
    }

    setLoadingVerify(true);
    try {
      const payload = { code };
      const res = await verifyOtp(payload); 
      setStatusMessage("OTP verified");
      onVerified?.(res);

           try {
      await getGuestDashboardData();
    } catch (refreshErr) {
      console.warn("Failed to refresh guest dashboard data:", refreshErr);
    }
    toast.success("Email verified");


      setTimeout(() => {
        onClose?.();
      }, 600);
    } catch (err) {
      setError(err?.message || "Failed to verify OTP");
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-auto">
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base">Verify your email</h3>
            <button onClick={onClose} className="text-gray-600"><FaTimes /></button>
          </div>

          {email ? (
            <p className="text-sm text-gray-600 mb-4">
              A verification code was sent to <span className="font-medium">{email}</span>. Enter it below.
            </p>
          ) : (
            <p className="text-sm text-gray-600 mb-4">A verification code was sent to your email. Enter it below.</p>
          )}

          {/* OTP boxes */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div
              className="flex items-center justify-center gap-2"
              onPaste={handlePaste}
              aria-hidden={false}
            >
              {Array.from({ length: OTP_LENGTH }).map((_, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={values[idx]}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-12 h-12 text-center rounded-md border border-gray-300 focus:border-teal-500 focus:shadow-sm form-input text-lg font-medium"
                  aria-label={`Digit ${idx + 1}`}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
            {statusMessage && <p className="text-xs text-green-600">{statusMessage}</p>}

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={loadingSend || cooldown > 0}
                className={`px-3 py-2 text-xs rounded border ${loadingSend || cooldown > 0 ? "text-gray-400 border-gray-200" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}
              >
                {loadingSend ? "Sending…" : (cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP")}
              </button>

              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="px-3 py-2 text-xs rounded border hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingVerify}
                  className="px-4 py-2 bg-teal-600 text-white text-xs rounded disabled:opacity-60"
                >
                  {loadingVerify ? "Verifying…" : "Verify"}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default EmailVerifyModal;
