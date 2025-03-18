const orderRoutes = require("express").Router();
const orderController = require("./../controllers/orderController");
const { auth } = require("../middlewares/auth");

orderRoutes.post("/createOrder", auth, orderController.createOrder);
orderRoutes.post("/updateOrder", orderController.updateOrder);
orderRoutes.post("/updateOrderStatus", orderController.updateOrderStatus);
orderRoutes.get("/fetchOrderForUser", auth, orderController.fetchOrdersForUser);
orderRoutes.get("/fetchAllOrdersForAdmin", orderController.fetchAllOrdersForAdmin);

module.exports = orderRoutes;
