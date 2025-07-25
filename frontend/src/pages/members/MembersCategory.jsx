import React, { useEffect, useState } from "react";
import { api } from "../../utils/Axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaArrowLeft,
  FaSyncAlt,
  FaUsers,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";

// Modal for editing member
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

const MemberCard = ({ member, onEdit, onDelete, loadingDelete }) => (
  <>
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-lg rounded-xl p-5 flex flex-col  gap-5 border border-blue-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-200">
      <div className="flex w-full items-center gap-5">
        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-extrabold uppercase shadow-lg">
          <FaUser />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {member.memberName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 mt-1">
            <span className="font-semibold">Zone:</span>
            <span>{member.zone}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(member)}
          className="inline-flex flex-auto items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm shadow transition"
          title="Edit"
        >
          {/* <h1>Edit</h1> */}
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(member)}
          className="inline-flex flex-auto items-center justify-center p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm shadow transition disabled:opacity-60"
          disabled={loadingDelete === member._id}
          title="Delete"
        >
          <FaTrash />
          {loadingDelete === member._id && (
            <span className="ml-1 text-xs">Deleting...</span>
          )}
        </button>
      </div>
    </div>
  </>
);

const MembersInCategory = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [category, setCategory] = useState(location.state?.category || null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Modal state for editing
  const [modalOpen, setModalOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [editForm, setEditForm] = useState({ memberName: "", zone: "" });
  const [saving, setSaving] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        // Fetch category details if not passed from navigation
        if (!category) {
          const catRes = await api.get(
            `/category/v1/get-categories-by-id/${categoryId}`
          );
          if (catRes.data && catRes.data.status === 200) {
            setCategory(catRes.data.category);
          }
        }
        // Fetch members in this category
        const res = await api.get(
          `/member/v1/get-members-by-category/${categoryId}`
        );
        if (res.data && res.data.success) {
          setMembers(res.data.members);
        } else {
          setFetchError("Failed to load members.");
        }
      } catch (err) {
        setFetchError("Error loading members.");
        toast.error("Error loading members.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
    // eslint-disable-next-line
  }, [categoryId]);

  // Edit
  const handleEdit = (member) => {
    setEditMember(member);
    setEditForm({
      memberName: member.memberName || "",
      zone: member.zone || "",
    });
    setModalOpen(true);
  };

  // Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(
        `/member/v1/update-members/${editMember._id}`,
        editForm
      );
      if (res.data && res.data.success) {
        toast.success(res.data.message);
        setMembers((prev) =>
          prev.map((m) =>
            m._id === editMember._id ? { ...m, ...editForm } : m
          )
        );
        setModalOpen(false);
      } else {
        toast.error("Failed to update member.");
      }
    } catch (err) {
      toast.error(err.message || "Error updating member.");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (member) => {
    if (
      !window.confirm(`Are you sure you want to delete "${member.memberName}"?`)
    )
      return;
    setLoadingDelete(member._id);
    try {
      const res = await api.delete(`/member/v1/delete-members/${member._id}`);
      if (res.data && res.data.success) {
        toast.success(res.data.message);
        setMembers((prev) => prev.filter((m) => m._id !== member._id));
      } else {
        toast.error("Failed to delete member.");
      }
    } catch (err) {
      toast.error(err.message || "Error deleting member.");
    } finally {
      setLoadingDelete(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-200 transition-colors"
        >
          <FaArrowLeft /> Back to Categories
        </button>
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg mb-2 flex items-center gap-3">
            <FaUsers className="text-blue-400" />
            {category ? category.categoryName : "Category Members"}
          </h1>
          <p className="text-blue-200 text-lg font-medium">
            Members in this category.
          </p>
        </header>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSyncAlt className="animate-spin text-blue-500 text-5xl" />
          </div>
        ) : fetchError ? (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-lg border border-red-200 flex items-center gap-2">
            {fetchError}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {members.length === 0 ? (
              <div className="col-span-full text-center text-blue-200 py-20 text-xl font-semibold">
                No members found in this category.
              </div>
            ) : (
              members.map((member) => (
                <MemberCard
                  key={member._id}
                  member={member}
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
          <FaEdit /> Edit Member
        </h2>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Member Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editForm.memberName}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, memberName: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Zone
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editForm.zone}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, zone: e.target.value }))
              }
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition disabled:opacity-60"
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
export default MembersInCategory;
