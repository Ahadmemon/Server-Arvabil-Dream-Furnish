const cartRoutes = require("express").Router();
const cartController = require("../controllers/cartController");
const { auth } = require("../middlewares/auth");

cartRoutes.get("/fetchCartItems", auth, cartController.fetchCartItems);
cartRoutes.post("/addToCart", auth, cartController.addToCart);
cartRoutes.post("/removeFromCart", auth, cartController.removeFromCart);
cartRoutes.post("/clearCart", auth, cartController.clearCart)
cartRoutes.post("/decrementQuantity", auth, cartController.decrementQuantity)
cartRoutes.post("/incrementQuantity", auth, cartController.incrementQuantity)
module.exports = cartRoutes;
