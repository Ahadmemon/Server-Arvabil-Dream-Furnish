const categoryModel = require("./../models/categoryModel");
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
    const { id } = req.query._id;
    try {
      const findCategoryIdToDelete = await categoryModel.findByIdAndDelete(id);
      if (!findCategoryIdToDelete) {
        return res.json({ success: false, message: "Category not found" });
      }
      const categories = await categoryModel.find();
      categories.save();
      return res.json({ succes: true, message: "Category deleted", data: categories })
    } catch (err) {
      return res.json({ success: false, message: err.message });
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
