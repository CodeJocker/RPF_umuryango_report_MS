import express from "express";
import {
  createPaymentReport,
  getPaymentReports,
  updatePaymentReport,
  deletePaymentReport,
} from "../controllers/payment.report.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const paymentReportRouter = express.Router();

// Create a new payment report
paymentReportRouter.post("/create-payment", verifyToken, createPaymentReport);

// Get all payment reports for the logged-in admin
paymentReportRouter.get("/view-payment", verifyToken, getPaymentReports);

// Update a payment report
paymentReportRouter.put("/update-payment/:reportId", verifyToken, updatePaymentReport);

// Delete a payment report
paymentReportRouter.delete("/delete-payment/:reportId", verifyToken, deletePaymentReport);

export default paymentReportRouter;
