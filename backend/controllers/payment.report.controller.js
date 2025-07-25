import PaymentReportModel from "../models/payment.report.model.js";

export const createPaymentReport = async (req, res) => {
  const { memberRef, amount,paymentMethod , paymentDate } = req.body;
  if (!memberRef || !amount || !paymentMethod || !paymentDate) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const newPaymentReport = new PaymentReportModel({
      memberRef: memberRef,
      amount: amount,
      paymentMethod:paymentMethod,
      paymentDate: paymentDate,
      admin: req.user._id,
    });
    await newPaymentReport.save();
    return res.status(201).json({
      success: true,
      message: "Payment report created successfully",
      data: newPaymentReport,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getPaymentReports = async (req, res) => {
  try {
    const paymentReports = await PaymentReportModel.find({
      admin: req.user._id,
    })
      .populate("memberRef", "memberName")
      .populate("admin", "username email");
    return res.status(200).json({
      success: true,
      paymentReports: paymentReports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updatePaymentReport = async (req, res) => {
    const { reportId } = req.params;
  const { memberRef, amount,paymentMethod, paymentDate } = req.body;
  if (!reportId || !amount || !paymentMethod || !paymentDate) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const updatedReport = await PaymentReportModel.findByIdAndUpdate(
      reportId,
      { memberRef, amount,paymentMethod, paymentDate },
      { new: true }
    );
    if (updatedReport) {
      return res.status(200).json({
        success: true,
        message: "Payment report updated successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Payment report not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deletePaymentReport = async (req, res) => {
  const { reportId } = req.params  ;
  if (!reportId) {
    return res.status(400).json({
      success: false,
      message: "Report ID is required",
    });
  }
  try {
    const deletedReport = await PaymentReportModel.findByIdAndDelete(reportId);
    if (deletedReport) {
      return res.status(200).json({
        success: true,
        message: "Payment report deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Payment report not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
