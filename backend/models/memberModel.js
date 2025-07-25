import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    memberName: {
      type: String,
      required: true,
    },
    zone: {
      type: String,
      required: true,
    },
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "categoryModel",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "userModel",
    },
  },
  { timestamps: true }
);

const MemberModel = mongoose.model('MemberModel', memberSchema)
export default MemberModel;