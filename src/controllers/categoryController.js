const categoryModel = require("./../models/categoryModel");
const mongoose = require("mongoose");

const categoryController = {
  addCategory: async function (req, res) {
    try {
      const categoryData = req.body;
      const newCategory = new categoryModel(categoryData);
      await newCategory.save();
      return res.json({
        success: true,
        message: "New category created",
        data: newCategory,
      });
    } catch (err) {
      return res.json({ success: false, message: err.message });
    }
  },


  deleteCategory: async function (req, res) {
    try {
      const { _id } = req.params; // Extracting _id correctly, name should be _id same as db
      console.log("Received ID:", _id); // Debugging log

      // Ensure ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid category ID" });
      }

      const deletedCategory = await categoryModel.findByIdAndDelete(_id);

      if (!deletedCategory) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }

      return res.json({ success: true, message: "Category deleted successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
  fetchAllCategories: async function (req, res) {
    try {
      const categories = await categoryModel.find();
      return res.json({
        succes: true,
        message: "All categories fetched",
        data: categories,
      });
    } catch (err) {
      return res.json({ success: false, message: err.message });
    }
  },
  fetchCategoryById: async function (req, res) {
    try {
      const id = req.params._id;
      const foundCategoryById = await categoryModel.findById(id);
      if (!foundCategoryById) {
        return res.json({ success: false, message: "Category not found" });
      }
      return res.json({
        succes: true,
        message: "Category fetched by id",
        data: foundCategoryById,
      });
    } catch (err) {
      return res.json({ success: false, message: err.message });
    }
  },
};
module.exports = categoryController;
