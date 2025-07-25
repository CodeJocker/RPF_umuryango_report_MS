import React, { useEffect, useState, useCallback } from "react";
import { api } from "../../utils/Axios";
import toast from "react-hot-toast";
import {
  FaSyncAlt,
  FaUserShield,
  FaUsers,
  FaUser,
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Modal Component
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
        >
          <FaTimes />
        </button>
        {children}
      </div>
    </div>
  );
};

const CategoryCard = React.memo(
  ({ category, onEdit, onDelete, loadingDelete }) => (
    <div className="w-auto bg-gradient-to-br from-white/90 to-blue-50 dark:from-gray-900 dark:to-gray-800 shadow-xl rounded-2xl p-6 flex flex-col gap-4 border border-blue-100 dark:border-gray-700 hover:shadow-2xl hover:scale-[1.025] transition-all duration-200 group">
      {/* Icon */}
      <div className="w-full flex items-center gap-4">
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-extrabold uppercase shadow-lg group-hover:scale-110 transition-transform duration-200">
          {category.categoryName?.[0] || "?"}
        </div>
        <div className="flex-1">
          <div className="all-div flex items-center justify-between">
            <div className="name-div">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                {category.categoryName}
              </h2>
            </div>
            {/* Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm
          ${
            // className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm
            category.isGroup
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-blue-100 text-blue-700 border border-blue-200"
          }
    `}
            >
              {category.isGroup ? (
                <span className="inline-flex items-center gap-1">
                  <FaUsers className="inline-block" /> Group
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <FaUser className="inline-block" /> Single
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
            <FaUserShield className="text-blue-500" />
            <span className="font-medium">Admin:</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {category.admin?.username || "N/A"}
            </span>
          </div>
        </div>
      </div>
      {category.description && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-2">
          <FaInfoCircle className="text-blue-400" />
          <span>{category.description}</span>
        </div>
      )}
      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onEdit(category)}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow transition"
        >
          <FaEdit /> Edit
        </button>
        <button
          onClick={() => onDelete(category)}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow transition disabled:opacity-60"
          disabled={loadingDelete === category._id}
        >
          <FaTrash />
          {loadingDelete === category._id ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  )
);

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({
    categoryName: "",
    isGroup: false,
  });
  const [saving, setSaving] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const navigate = useNavigate()

  const handleFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/category/v1/get-categories");
      if (res.data && res.data.status === 200) {
        setCategories(res.data.categories);
      } else {
        setError("Failed to fetch categories.");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // Edit
  const handleEdit = (category) => {
    setEditCategory(category);
    let isGroupValue = category.isGroup;
    if (typeof isGroupValue === "string") {
      isGroupValue = isGroupValue === "true";
    }
    setForm({
      categoryName: category.categoryName || "",
      isGroup: isGroupValue,
    });
    setModalOpen(true);
  };

  // Delete
  const handleDelete = async (category) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${category.categoryName}"?`
      )
    )
      return;
    setLoadingDelete(category._id);
    try {
      const res = await api.delete(
        `/category/v1/delete-categories/${category._id}`
      );
      if (res.data && res.data.status === 200) {
        toast.success(res.data.message);
        setCategories((prev) => prev.filter((c) => c._id !== category._id));
      } else {
        toast.error("Failed to delete category.");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingDelete(null);
    }
  };

  // Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(
        `/category/v1/update-categories/${editCategory._id}`,
        form
      );
      if (res.data && res.data.status === 200) {
        toast.success("Category updated!");
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editCategory._id ? { ...cat, ...form } : cat
          )
        );
        setModalOpen(false);
      } else {
        toast.error("Failed to update category.");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-200 transition-colors"
        >
          <FaArrowLeft /> Back to Categories Home
        </button>
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
              Categories
            </h1>
            <p className="text-blue-200 mt-2 text-lg font-medium">
              Browse all available categories and their details.
            </p>
          </div>
          <button
            onClick={handleFetch}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:from-orange-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <FaSyncAlt className="animate-spin h-5 w-5" />
            ) : (
              <FaSyncAlt className="h-5 w-5" />
            )}
            Refresh
          </button>
        </header>
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-lg border border-red-200 flex items-center gap-2">
            <FaInfoCircle className="text-red-400" />
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSyncAlt className="animate-spin text-blue-500 text-5xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8">
            {categories.length === 0 ? (
              <div className="col-span-full text-center text-blue-200 py-20 text-xl font-semibold">
                No categories found.
              </div>
            ) : (
              categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loadingDelete={loadingDelete}
                />
              ))
            )}
          </div>
        )}
      </div>
      {/* Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <FaEdit /> Edit Category
        </h2>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Category Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.categoryName}
              onChange={(e) =>
                setForm((f) => ({ ...f, categoryName: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isGroup"
              checked={form.isGroup}
              onChange={(e) =>
                setForm((f) => ({ ...f, isGroup: e.target.checked }))
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isGroup"
              className="text-sm text-gray-700 dark:text-gray-200"
            >
              Is Group Category
            </label>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold shadow transition disabled:opacity-60"
            disabled={saving}
          >
            {saving ? (
              <>
                <FaSyncAlt className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <FaSave /> Update
              </>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ViewCategory;
