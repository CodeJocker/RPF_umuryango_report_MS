import React, { useEffect, useState } from "react";
import { api } from "../../utils/Axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  FaMoneyCheckAlt,
  FaUser,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaSearch,
  FaFilter,
  FaSave,
  FaTimes,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaArrowLeft,
  FaDownload,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PAYMENT_METHODS = {
  cash: "Cash",
  "momo pay": "Momo Pay",
  "airtel money": "Airtel Money",
  "borderaux payed": "Borderaux Payed",
};

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-blue-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition"
        >
          <FaTimes />
        </button>
        {children}
      </div>
    </div>
  );
};

const PaymentCard = ({
  payment,
  memberDetails,
  categoryDetails,
  onEdit,
  onDelete,
  loadingDelete,
}) => (
  <div className="bg-slate-900 rounded-2xl p-7 flex flex-col md:flex-row md:items-center gap-7 border border-orange-200 dark:border-orange-800 hover:shadow-3xl hover:scale-[1.015] transition-all duration-200">
    <div className="flex-shrink-0 w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-extrabold uppercase border-4 border-white dark:border-slate-900">
      <FaMoneyCheckAlt />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex flex-col md:flex-row md:items-center md:gap-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate flex items-center gap-2">
            <FaUser className="text-orange-600" />
            {memberDetails?.memberName || "N/A"}
          </h3>
          <div className="flex items-center gap-2 text-base text-gray-500 dark:text-gray-300 mt-1">
            <FaMapMarkerAlt className="text-orange-600" />
            <span className="font-semibold">Zone:</span>
            <span>{memberDetails?.zone || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-base text-gray-500 dark:text-gray-300 mt-1">
            <FaLayerGroup className="text-orange-600" />
            <span className="font-semibold">Category:</span>
            <span>
              {categoryDetails?.categoryName || (
                <span className="italic text-slate-400">Not assigned</span>
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:items-end md:ml-auto mt-2 md:mt-0">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-100/80 text-orange-700 text-sm font-semibold border border-blue-300 shadow">
            {PAYMENT_METHODS[payment.paymentMethod] || payment.paymentMethod}
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <FaCalendarAlt className="text-orange-600" />
            {new Date(payment.paymentDate).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-3">
        <span className="text-2xl font-extrabold text-orange-600 dark:orange-blue-400 drop-shadow">
          {Number(payment.amount).toLocaleString()} RWF
        </span>
      </div>
    </div>
    <div className="flex flex-col gap-2 md:ml-4">
      <button
        onClick={() => onEdit(payment)}
        className="inline-flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg shadow transition"
        title="Edit"
      >
        <FaEdit />
      </button>
      <button
        onClick={() => onDelete(payment)}
        className="inline-flex items-center justify-center p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-lg shadow transition disabled:opacity-60"
        disabled={loadingDelete === payment._id}
        title="Delete"
      >
        <FaTrash />
        {loadingDelete === payment._id && (
          <span className="ml-1 text-xs">Deleting...</span>
        )}
      </button>
    </div>
  </div>
);

const PaymentView = () => {
  const [payments, setPayments] = useState([]);
  const [membersMap, setMembersMap] = useState({});
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Search/filter state
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filtered, setFiltered] = useState([]);

  // Modal state for editing
  const [modalOpen, setModalOpen] = useState(false);
  const [editPayment, setEditPayment] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    paymentMethod: "",
    paymentDate: "",
  });
  const [saving, setSaving] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch all payments, members, and categories
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const [paymentsRes, membersRes, categoriesRes] = await Promise.all([
          api.get("/payment/report/v1/view-payment"),
          api.get("/member/v1/get-members"),
          api.get("/category/v1/get-categories"),
        ]);
        if (paymentsRes.data && paymentsRes.data.success) {
          setPayments(
            paymentsRes.data.reports || paymentsRes.data.paymentReports || []
          );
        } else {
          setFetchError("Failed to load payment reports.");
        }
        if (membersRes.data && membersRes.data.success) {
          const map = {};
          for (const m of membersRes.data.members) {
            map[m._id] = m;
          }
          setMembersMap(map);
        }
        if (categoriesRes.data && categoriesRes.data.status === 200) {
          const cMap = {};
          for (const c of categoriesRes.data.categories) {
            cMap[c._id] = c;
          }
          setCategoriesMap(cMap);
        }
      } catch (err) {
        setFetchError("Error loading payment reports, members, or categories.");
        toast.error("Error loading payment reports, members, or categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filtering logic
  useEffect(() => {
    let data = payments;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter((p) => {
        const member =
          membersMap[p.memberRef?._id || p.memberRef] || p.memberRef;
        return (
          member?.memberName?.toLowerCase().includes(s) ||
          member?.zone?.toLowerCase().includes(s)
        );
      });
    }
    if (filterDate) {
      data = data.filter(
        (p) => new Date(p.paymentDate).toISOString().slice(0, 10) === filterDate
      );
    }
    setFiltered(data);
  }, [payments, search, filterDate, membersMap]);

  // Calculate total paid amount
  const totalPaid = filtered.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  // Edit
  const handleEdit = (payment) => {
    setEditPayment(payment);
    setEditForm({
      amount: payment.amount || "",
      paymentMethod: payment.paymentMethod || "",
      paymentDate: payment.paymentDate
        ? new Date(payment.paymentDate).toISOString().slice(0, 10)
        : "",
    });
    setModalOpen(true);
  };

  // Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(
        `/payment/report/v1/update-payment/${editPayment._id}`,
        editForm
      );
      if (res.data && res.data.success) {
        toast.success("Payment report updated!");
        setPayments((prev) =>
          prev.map((p) =>
            p._id === editPayment._id ? { ...p, ...editForm } : p
          )
        );
        setModalOpen(false);
      } else {
        toast.error("Failed to update payment report.");
      }
    } catch (err) {
      toast.error(err.message || "Error updating payment report.");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (payment) => {
    const member = membersMap[payment.memberRef?._id || payment.memberRef];
    if (
      !window.confirm(
        `Are you sure you want to delete the payment for "${
          member?.memberName || "N/A"
        }"?`
      )
    )
      return;
    setLoadingDelete(payment._id);
    try {
      const res = await api.delete(
        `/payment/report/v1/delete-payment/${payment._id}`
      );
      if (res.data && res.data.success) {
        toast.success("Payment report deleted!");
        setPayments((prev) => prev.filter((p) => p._id !== payment._id));
      } else {
        toast.error("Failed to delete payment report.");
      }
    } catch (err) {
      toast.error(err.message || "Error deleting payment report.");
    } finally {
      setLoadingDelete(null);
    }
  };

  // PDF Download Handler
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
    });

    doc.setFontSize(18);
    doc.text("Payment Reports", 40, 40);

    const tableColumn = [
      "#",
      "Member Name",
      "Zone",
      "Category",
      "Amount (RWF)",
      "Payment Method",
      "Payment Date",
    ];

    const tableRows = filtered.map((payment, idx) => {
      const member = membersMap[payment.memberRef?._id || payment.memberRef];
      const category =
        member && member.categoryRef
          ? categoriesMap[member.categoryRef?._id || member.categoryRef]
          : null;
      return [
        idx + 1,
        member?.memberName || "N/A",
        member?.zone || "N/A",
        category?.categoryName || "Not assigned",
        Number(payment.amount).toLocaleString(),
        PAYMENT_METHODS[payment.paymentMethod] || payment.paymentMethod,
        new Date(payment.paymentDate).toLocaleDateString(),
      ];
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      styles: {
        fontSize: 10,
        cellPadding: 4,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
    });

    // Add total paid amount at the end
    doc.setFontSize(14);
    doc.text(
      `Total Paid: ${totalPaid.toLocaleString()} RWF`,
      40,
      doc.lastAutoTable.finalY + 30
    );

    doc.save("payment_report.pdf");
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-200 transition-colors"
        >
          <FaArrowLeft /> Back to Payment Report
        </button>
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3 drop-shadow">
              <FaMoneyCheckAlt /> Payment Reports
            </h1>
            <p className="text-blue-200 text-lg font-medium">
              View, search, filter, update, and delete payment reports.
              <br />
              <span className="text-blue-300">
                All member and category details are displayed for clarity.
              </span>
            </p>
            <div className="mt-4 text-xl font-bold text-orange-400 bg-slate-800 rounded-xl px-5 py-3 inline-block shadow">
              Total Paid: {totalPaid.toLocaleString()} RWF
            </div>
          </div>
          <div className="w-fulls flex flex-col md:grid md:grid-cols-2 gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by member or zone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-slate-400" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
              />
            </div>
            <button
              onClick={handleDownloadPDF}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200"
            >
              <FaDownload /> Download PDF Report
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSyncAlt className="animate-spin text-blue-500 text-5xl" />
          </div>
        ) : fetchError ? (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-lg border border-red-200 flex items-center gap-2">
            {fetchError}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center text-blue-200 py-20 text-2xl font-semibold">
                No payment reports found.
              </div>
            ) : (
              filtered.map((payment) => {
                const member =
                  membersMap[payment.memberRef?._id || payment.memberRef];
                const category =
                  member && member.categoryRef
                    ? categoriesMap[
                        member.categoryRef?._id || member.categoryRef
                      ]
                    : null;
                return (
                  <PaymentCard
                    key={payment._id}
                    payment={payment}
                    memberDetails={member}
                    categoryDetails={category}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loadingDelete={loadingDelete}
                  />
                );
              })
            )}
          </div>
        )}

        {/* Edit Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            <FaEdit /> Edit Payment Report
          </h2>
          <form onSubmit={handleUpdate} className="flex flex-col gap-6">
            <div>
              <label className="block text-base font-medium text-blue-200 mb-2">
                Amount
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-blue-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, amount: e.target.value }))
                }
                min="1"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-blue-200 mb-2">
                Payment Method
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-blue-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editForm.paymentMethod}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    paymentMethod: e.target.value,
                  }))
                }
                required
              >
                <option value="">Select payment method</option>
                {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium text-blue-200 mb-2">
                Payment Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-blue-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editForm.paymentDate}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    paymentDate: e.target.value,
                  }))
                }
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition disabled:opacity-60"
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
    </div>
  );
};

export default PaymentView;
