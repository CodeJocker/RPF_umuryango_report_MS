import React, { useState, useEffect } from "react";
import { api } from "../../utils/Axios";
import toast from "react-hot-toast";
import {
  FaMoneyCheckAlt,
  FaUser,
  FaCalendarAlt,
  FaSave,
  FaSyncAlt,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "momo pay", label: "Momo Pay" },
  { value: "airtel money", label: "Airtel Money" },
  { value: "borderaux payed", label: "Borderaux Payed" },
];

const PaymentReportCreate = ({ onCreated }) => {
  const [form, setForm] = useState({
    memberRef: "",
    amount: "",
    paymentMethod: "",
    paymentDate: "",
  });
  const [members, setMembers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingMembers, setFetchingMembers] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      setFetchingMembers(true);
      try {
        const res = await api.get("/member/v1/get-members");
        if (res.data && res.data.success) {
          setMembers(res.data.members);
        } else {
          toast.error("Failed to load members.");
        }
      } catch (err) {
        toast.error("Error loading members.");
      } finally {
        setFetchingMembers(false);
      }
    };
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.memberRef) {
      newErrors.memberRef = "Member is required";
    }
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }
    if (
      !form.paymentMethod ||
      !PAYMENT_METHODS.map((m) => m.value).includes(form.paymentMethod)
    ) {
      newErrors.paymentMethod = "Select a valid payment method";
    }
    if (!form.paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setSubmitStatus(null);
    try {
      const res = await api.post("/payment/report/v1/create-payment", form);
      if (res.data && res.data.success) {
        toast.success("Payment report created successfully!");
        setSubmitStatus({
          type: "success",
          message: "Payment report created successfully!",
        });
        setForm({
          memberRef: "",
          amount: "",
          paymentMethod: "",
          paymentDate: "",
        });
        navigate("/payment-report/view");
        if (onCreated) onCreated();
      } else {
        setSubmitStatus({
          type: "error",
          message: res.data.message || "Failed to create payment report.",
        });
        toast.error(res.data.message || "Failed to create payment report.");
      }
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: err.message || "Error creating payment report.",
      });
      toast.error(err.message || "Error creating payment report.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      memberRef: "",
      amount: "",
      paymentMethod: "",
      paymentDate: "",
    });
    setErrors({});
    setSubmitStatus(null);
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-200 transition-colors"
        >
          <FaArrowLeft /> Back to Payment Home
        </button>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <FaPlus /> Register Payment Report
          </h1>
          <p className="text-slate-400">Record a new payment for a member.</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Member Select */}
            <div className="space-y-2">
              <label
                htmlFor="memberRef"
                className="block text-sm font-medium text-slate-200"
              >
                Member <span className="text-red-400">*</span>
              </label>
              <select
                id="memberRef"
                name="memberRef"
                value={form.memberRef}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-600 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.memberRef
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-500 focus:ring-orange-500 focus:border-orange-500"
                }`}
                required
                disabled={fetchingMembers || loading}
              >
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.memberName}
                  </option>
                ))}
              </select>
              {errors.memberRef && (
                <p className="text-red-400 text-sm flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.memberRef}
                </p>
              )}
            </div>

            {/* Amount Field */}
            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-slate-200"
              >
                Amount <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter payment amount"
                className={`w-full px-4 py-3 bg-slate-600 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.amount
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-500 focus:ring-orange-500 focus:border-orange-500"
                }`}
                min="1"
                step="0.01"
                disabled={loading}
              />
              {errors.amount && (
                <p className="text-red-400 text-sm flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium text-slate-200"
              >
                Payment Method <span className="text-red-400">*</span>
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-600 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.paymentMethod
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-500 focus:ring-orange-500 focus:border-orange-500"
                }`}
                required
                disabled={loading}
              >
                <option value="">Select payment method</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && (
                <p className="text-red-400 text-sm flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.paymentMethod}
                </p>
              )}
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <label
                htmlFor="paymentDate"
                className="block text-sm font-medium text-slate-200"
              >
                Payment Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                id="paymentDate"
                name="paymentDate"
                value={form.paymentDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-600 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.paymentDate
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-500 focus:ring-orange-500 focus:border-orange-500"
                }`}
                disabled={loading}
              />
              {errors.paymentDate && (
                <p className="text-red-400 text-sm flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.paymentDate}
                </p>
              )}
            </div>

            {/* Status Message */}
            {submitStatus && (
              <div
                className={`p-4 rounded-lg flex items-center ${
                  submitStatus.type === "success"
                    ? "bg-green-900/50 border border-green-500 text-green-200"
                    : "bg-red-900/50 border border-red-500 text-red-200"
                }`}
              >
                <svg
                  className={`w-5 h-5 mr-2 ${
                    submitStatus.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {submitStatus.type === "success" ? (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
                {submitStatus.message}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || fetchingMembers}
                className="cursor-pointer flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-700"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FaSyncAlt className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Creating...
                  </span>
                ) : (
                  "Create Payment Report"
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="cursor-pointer flex-1 sm:flex-none bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-700"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
          <h3 className="text-sm font-medium text-slate-200 mb-2">
            Payment Report Guidelines:
          </h3>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Select the correct member for the payment</li>
            <li>• Amount must be a positive number</li>
            <li>
              • Payment method must be one of: Cash, Momo Pay, Airtel Money,
              Borderaux Payed
            </li>
            <li>• Payment date is required</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default PaymentReportCreate;
