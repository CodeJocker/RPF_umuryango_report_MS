import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createMember, deleteMember, getMembers, getMembersByCategory, updateMember } from "../controllers/member.controller.js";

const memberRouter = express.Router();

// Protected route to create a member
memberRouter.post("/create", verifyToken, createMember);
memberRouter.get("/get-members", verifyToken, getMembers);
memberRouter.put("/update-members/:memberId", verifyToken, updateMember);
memberRouter.delete("/delete-members/:memberId", verifyToken, deleteMember);
memberRouter.get(
  "/get-members-by-category/:categoryId",
  verifyToken,
  getMembersByCategory
);

// Add more member routes here (e.g., get all, update, delete, etc.)

export default memberRouter;
