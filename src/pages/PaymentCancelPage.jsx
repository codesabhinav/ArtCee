import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-md p-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-50 mx-auto mb-4">
          <FaTimesCircle className="text-yellow-600 text-4xl" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">Payment Cancelled</h2>
        <p className="text-sm text-gray-600 mb-4">You cancelled the payment. No charges were made.</p>

        <div className="flex gap-3 justify-center mb-4">
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded-md text-xs">Try again</button>
          <Link to="/featured" className="px-4 py-2 bg-orange-500 text-white rounded-md text-xs">View Plans</Link>
        </div>

        <p className="text-xs text-gray-500">Need help? <a href="mailto:support@artcee.co" className="underline">Contact support</a></p>
      </div>
    </div>
  );
}
