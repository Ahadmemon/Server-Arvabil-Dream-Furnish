const productRoutes = require("express").Router();
const { auth } = require("./../middlewares/auth");
const productController = require("./../controllers/productController");
productRoutes.post("/addProduct", productController.addProduct);
productRoutes.delete("/deleteProduct", productController.deleteProduct);
productRoutes.get("/fetchAllProducts", productController.fetchAllProducts);
// productRoutes.use(auth);

// productRoutes.post("/:productId/addFeedback", auth, productController.addFeedback);
productRoutes.get("/fetchProductsByCategory", productController.fetchProductsByCategory);

module.exports = productRoutes;
