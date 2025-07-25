import CategoryModel from "../models/member.category.model.js";

export const createCategory = async (req, res) => {
  const { categoryName, isGroup } = req.body;
  if (!categoryName || isGroup === undefined) {
    return res.json({
      message: "all fields required please !!!",
      success: false,
    });
  }
  try {
    const data = new CategoryModel({
      categoryName: categoryName,
      isGroup: isGroup,
      admin: req.user._id, // Assuming req.user is set after authentication
    });
    const saved_data = await data.save();
    if (saved_data) {
      return res.status(200).json({
        success: true,
        message: "Category created successfully",
        status: 200,
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({
      admin: req.user._id,
    }).populate("admin", "username email");
    return res.status(200).json({
      success: true,
      categories: categories,
      status: 200,
    });
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    return res.status(404).json({
      message : "all fields required please !!!!!"
    })
  }
  try {
    const result = await CategoryModel.find({ _id: categoryId }).populate("admin", "username email")
    return res.status(200).json({
      success: true,
      categories: result,
      status: 200,
    });
  } catch (error) {
    return res.json({
      success: false, 
      error : error.message
    })
  }
}

export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { categoryName, isGroup } = req.body;
  if (!categoryId || !categoryName || isGroup === undefined) {
    return res.json({
      message: "all fields required please !!!",
      success: false,
    });
  }
  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { categoryName, isGroup },
      { new: true }
    );
    if (updatedCategory) {
      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        status: 200,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    return res.json({
      message: "Category ID is required",
      success: false,
    });
  }
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);
    if (deletedCategory) {
      return res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        status: 200,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};

// import express from 'express';
