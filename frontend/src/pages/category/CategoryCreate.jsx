import React, { useState } from "react";
import { api } from "../../utils/Axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
const CategoryCreate = () => {
  const [formData, setFormData] = useState({
    categoryName: "",
    isGroup: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    } else if (formData.categoryName.trim().length < 2) {
      newErrors.categoryName = "Category name must be at least 2 characters";
    } else if (formData.categoryName.trim().length > 50) {
      newErrors.categoryName = "Category name must be less than 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await api.post("/category/v1/create", formData);

      const result = await response.data;

      if (response.status === 200 && result.success) {
        setSubmitStatus({
          type: "success",
          message: "Category created successfully!",
        });
        toast.success(result.message || "Category created successfully!");
        // Reset form
        setFormData({
          categoryName: "",
          isGroup: false,
        });
        navigate("/category/view");
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Failed to create category",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please try again.",
      });
      toast.error(error.message || "Network error. Please try again.");
      console.error("Error creating category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      categoryName: "",
      isGroup: false,
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
          <FaArrowLeft /> Back to Categories
        </button>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create New Category
          </h1>
          <p className="text-slate-400">
            Add a new category to organize your content
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-slate-200"
              >
                Category Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                placeholder="Enter the category name"
                className={`w-full px-4 py-3 bg-slate-600 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.categoryName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-500 focus:ring-orange-500 focus:border-orange-500"
                }`}
                disabled={isSubmitting}
              />
              {errors.categoryName && (
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
                  {errors.categoryName}
                </p>
              )}
            </div>

            {/* Grouped Checkbox */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200">
                Category Options
              </label>
              <div className="flex items-center space-x-3 p-3 bg-slate-600 rounded-lg">
                <input
                  type="checkbox"
                  id="isGroup"
                  name="isGroup"
                  checked={formData.isGroup}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-slate-500 border-slate-400 rounded focus:ring-orange-500 focus:ring-2"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="isGroup"
                  className="text-slate-200 cursor-pointer"
                >
                  Enable grouping for this category
                </label>
              </div>
              <p className="text-xs text-slate-400">
                Grouped categories can contain subcategories and organize
                content hierarchically
              </p>
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
                disabled={isSubmitting}
                className="cursor-pointer flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-700"
              >
                {isSubmitting ? (
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
                  "Create Category"
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
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
            Category Guidelines:
          </h3>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Category names should be descriptive and unique</li>
            <li>• Use grouped categories for hierarchical organization</li>
            <li>• Category names are case-sensitive</li>
            <li>• Special characters are allowed but use them sparingly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
