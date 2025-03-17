const categoryRoutes = require("express").Router();
const categoryController = require("./../controllers/categoryController");
categoryRoutes.post("/addCategory", categoryController.addCategory);
categoryRoutes.get("/fetchAllCategories", categoryController.fetchAllCategories);
categoryRoutes.get("/:_id", categoryController.fetchCategoryById);
categoryRoutes.delete("/deleteCategory", categoryController.deleteCategory);
module.exports = categoryRoutes;
