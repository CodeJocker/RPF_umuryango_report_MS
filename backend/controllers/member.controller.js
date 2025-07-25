import MemberModel from "../models/memberModel.js";

export const createMember = async (req, res) => {
    const { memberName, zone, categoryRef } = req.body;
    if (!memberName || !zone || !categoryRef) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    try {
        const newMember = new MemberModel({
            memberName: memberName,
            zone: zone,
            categoryRef: categoryRef,
            admin: req.user._id
        });
        await newMember.save();
        return res.status(201).json({
            success: true,
            message: "Member created successfully",
            data: newMember
        });
    } catch (error) {   
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const getMembers = async (req, res) => {
    try {
        const members = await MemberModel.find({ admin: req.user._id })
            .populate('admin', 'username email')
            .populate('categoryRef', 'name');
        return res.status(200).json({
            success: true,
            members: members
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const updateMember = async (req, res) => {
    const { memberId } = req.params;
    const { memberName, zone } = req.body;
    if (!memberId || !memberName || !zone) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    try {
        const updatedMember = await MemberModel.findByIdAndUpdate(
            memberId,
            { memberName, zone },
            { new: true }
        );
        if (updatedMember) {
            return res.status(200).json({
                success: true,
                message: "Member updated successfully",
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const deleteMember = async (req, res) => {
    const { memberId } = req.params;
    if (!memberId) {
        return res.status(400).json({
            success: false,
            message: "Member ID is required"
        });
    }
    try {
        const deletedMember = await MemberModel.findByIdAndDelete(memberId);
        if (deletedMember) {
            return res.status(200).json({
                success: true,
                message: "Member deleted successfully"
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const getMembersByCategory = async (req, res) => {
    const { categoryId } = req.params;
    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: "Category name is required"
        });
    }
    try {
        const members = await MemberModel.find({ categoryRef: categoryId })
          .populate("admin", "username email")
          .populate("categoryRef", "name");
        return res.status(200).json({
            success: true,
            members: members,
            message: "members retrieved successfully",
            status : 200 
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}