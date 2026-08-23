import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FiLoader, FiCreditCard } from "react-icons/fi";
import { getPaymentHistory } from "../../services/courseDetailsAPI";

const formatCurrency = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "N/A";

const PaymentHistory = () => {
  const { token } = useSelector((state) => state.auth);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      const result = await getPaymentHistory(token);
      setPayments(result);
      setLoading(false);
    };

    if (token) loadPayments();
  }, [token]);

  const totalSpent = useMemo(
    () => payments.reduce((total, payment) => total + (payment.amount || 0), 0),
    [payments]
  );

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <FiLoader className="animate-spin text-3xl text-[#A78BFA]" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-white">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-medium text-richblack-5">Payment History</h1>
          <p className="mt-2 text-sm text-richblack-300">
            Track your course purchases and payment references.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-3">
          <p className="text-xs text-gray-400">Total Spent</p>
          <p className="text-xl font-bold text-[#FACC15]">{formatCurrency(totalSpent)}</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-richblack-700 bg-richblack-800 p-6 text-center">
          <FiCreditCard className="mb-3 text-4xl text-richblack-400" />
          <p className="text-lg text-richblack-200">No payments found yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-richblack-700 bg-richblack-800">
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-4 border-b border-richblack-700 bg-richblack-900/50 p-5 text-sm font-semibold text-richblack-300">
            <div>Courses</div>
            <div>Payment ID</div>
            <div>Date</div>
            <div className="text-right">Amount</div>
          </div>

          <div className="divide-y divide-richblack-700/50">
            {payments.map((payment) => (
              <div key={payment._id} className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-4 p-5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-richblack-5">
                    {payment.courses?.map((course) => course.courseName).join(", ") || "Course purchase"}
                  </p>
                  <p className="mt-1 text-xs text-richblack-400">Order: {payment.orderId}</p>
                </div>
                <div className="break-all text-richblack-300">{payment.paymentId}</div>
                <div className="text-richblack-300">{formatDate(payment.createdAt)}</div>
                <div className="text-right font-semibold text-[#FACC15]">
                  {formatCurrency(payment.amount, payment.currency)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
