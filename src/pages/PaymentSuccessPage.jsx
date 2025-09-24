import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaSpinner, FaFileInvoice } from "react-icons/fa";
import { fetchPaymentStatus } from "../Hooks/useSeller";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const params = new URLSearchParams(search);
  const sessionId = params.get("session_id");

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      if (!sessionId) {
        setError("No session id provided in redirect URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fd = new FormData();
        fd.append("session_id", sessionId);

        const data = await fetchPaymentStatus(fd);
        if (!cancelled) setResult(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Verification failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const goToDashboard = () => navigate("/profile");
  const viewInvoice = () => {
    const invoiceUrl = result?.data?.transactions?.receipt_url || result?.data?.invoice_url;
    if (invoiceUrl) {
      window.open(invoiceUrl, "_blank");
    } else {
      navigate("/dashboard");
    }
  };

  const txn = result?.data?.transactions || {};
  const displayAmount = txn.amount ? `${txn.amount} ${txn.currency || ""}` : "—";
  const transactionId = txn.payment_transection_id || txn.payment_ss_id || txn.id || "—";
  const txnStatus = txn.status || result?.status || "—";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-md p-6">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <FaSpinner className="animate-spin text-3xl text-indigo-600" />
            <p className="text-sm text-gray-600">Confirming your payment. This may take a few seconds...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
              <FaCheckCircle className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => window.location.reload()} className="px-4 py-2 text-xs border rounded-md">Retry</button>
              <Link to="/contact" className="px-4 py-2 text-xs bg-orange-500 text-white rounded-md">Contact Support</Link>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mx-auto mb-4">
              <FaCheckCircle className="text-green-600 text-4xl" />
            </div>

            <h2 className="text-2xl font-semibold mb-2">Payment {txnStatus === "completed" ? "Successful" : txnStatus}</h2>
            <p className="text-sm text-gray-600 mb-4">Thank you your payment was processed.</p>

              <button onClick={goToDashboard} className="px-4 py-2 rounded-md border text-xs bg-teal-500 text-white">Go to Dashboard</button>


            <p className="text-xs text-gray-500 mt-4">If you have questions, contact support at <a href="mailto:support@artcee.co" className="underline">support@artcee.co</a></p>
          </div>
        )}
      </div>
    </div>
  );
}
