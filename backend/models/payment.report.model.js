import mongoose from "mongoose";

const paymentReportSchema = new mongoose.Schema(
  {
    memberRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "MemberModel",
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "userModel",
    },
  },
  { timestamps: true }
);

const PaymentReportModel = mongoose.model('PaymentReportModel', paymentReportSchema)
export default PaymentReportModel;