import React, { useState, useEffect } from "react";
import { api } from "../../utils/Axios";
import toast from "react-hot-toast";
import {
  FaUserPlus,
  FaUser,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MembersCreate = ({ onCreated }) => {
  const [form, setForm] = useState({
    memberName: "",
    zone: "",
    categoryRef: "",
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setFetchingCategories(true);
      try {
        const res = await api.get("/category/v1/get-categories");
        if (res.data && res.data.status === 200) {
          setCategories(res.data.categories);
        } else {
          toast.error("Failed to load categories.");
        }
      } catch (err) {
        toast.error("Error loading categories.");
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.memberName.trim()) {
      newErrors.memberName = "Member name is required";
    } else if (form.memberName.trim().length < 2) {
      newErrors.memberName = "Member name must be at least 2 characters";
    }
    if (!form.zone.trim()) {
      newErrors.zone = "Zone is required";
    }
    if (!form.categoryRef) {
      newErrors.categoryRef = "Category is required";
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
      const res = await api.post("/member/v1/create", form);
      if (res.data && res.data.success) {
        toast.success("Member created successfully!");
        setSubmitStatus({
          type: "success",
          message: "Member created successfully!",
        });
        setForm({ memberName: "", zone: "", categoryRef: "" });
        navigate("/members/view/");
        if (onCreated) onCreated();
      } else {
        setSubmitStatus({
          type: "error",
          message: res.data.message || "Failed to create member.",
        });
        toast.error(res.data.message || "Failed to create member.");
      }
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: err.message || "Error creating member.",
      });
      toast.error(err.message || "Error creating member.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ memberName: "", zone: "", categoryRef: "" });
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
          <FaArrowLeft /> Back to Members
        </button>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <FaUserPlus /> Add New Member
          </h1>
          <p className="text-slate-400">
            Register a new member and assign them to a category.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Member Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="memberName"
                className="block text-sm font-medium text-slate-200"
              >
                Member Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="memberName"
                name="memberName"
                value={form.memberName}
                onChange={handleChange}
                placeholder="Enter the member name"
                className={`w-full px-4 py-3 bg-slate-600 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.memberName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-500 focus:ring-orange-500 focus:border-orange-500"
                }`}
                disabled={loading}
              />
              {errors.memberName && (
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
                  {errors.memberName}
                </p>
              )}
            </div>

            {/* Zone Field */}
            <div className="space-y-2">
              <label
                htmlFor="zone"
                className="block text-sm font-medium text-slate-200"
              >
                Zone <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="zone"
                name="zone"
                value={form.zone}
                onChange={handleChange}
                placeholder="Enter the zone"
                className={`w-full px-4 py-3 bg-slate-600 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.zone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-500 focus:ring-orange-500 focus:border-orange-500"
                }`}
                disabled={loading}
              />
              {errors.zone && (
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
                  {errors.zone}
                </p>
              )}
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label
                htmlFor="categoryRef"
                className="block text-sm font-medium text-slate-200"
              >
                Category <span className="text-red-400">*</span>
              </label>
              <select
                id="categoryRef"
                name="categoryRef"
                value={form.categoryRef}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-600 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.categoryRef
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-500 focus:ring-orange-500 focus:border-orange-500"
                }`}
                required
                disabled={fetchingCategories || loading}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryRef && (
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
                  {errors.categoryRef}
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
                disabled={loading || fetchingCategories}
                className="cursor-pointer flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-700"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Member"
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
            Member Guidelines:
          </h3>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Member names should be descriptive and unique</li>
            <li>• Assign each member to the correct category</li>
            <li>• Zone should reflect the member's area or department</li>
            <li>• All fields are required for member registration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default MembersCreate;
