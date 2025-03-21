const cartModel = require("../models/cartModel");
const { productModel } = require("./../models/productModel");
const userModel = require("./../models/userModel");
const mongoose = require("mongoose")
const cartController = {
  fetchCartItems: async function (req, res) {
    try {
      const user = req.user;
      const foundCart = await cartModel.findOne({ userId: user }).populate('items.product');//userId is field in cartModel which accepts _id of user
      console.log('User ID:', user);
      console.log('Found Cart:', foundCart);
      if (!foundCart) {
        return res.json({
          success: true,
          message: "Cart does not exist",
          data: [],
        });
      }

      return res.json({
        success: true,
        message: "Cart found",
        data: foundCart,
      });
    } catch (err) {
      return res.json({ success: false, message: err.message });
    }
  },
  addToCart: async function (req, res) {
    try {
      const reqData = req.body;
      console.log('Request Data:', reqData);
      console.log('Requested Product ID:', reqData.product._id);
      // Find the product by ID
      const product = await productModel.findById(reqData.product._id);

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Find the user from the request
      const user = await userModel.findById(req.user);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      let cart = await cartModel.findOne({ userId: req.user });
      if (!cart) {
        cart = new cartModel({ userId: req.user, items: [] });
      }

      // Check if the product already exists in the cart
      let productInCart = cart.items.find(item => item.product._id.equals(product._id));
      console.log('Product in cart:', productInCart);
      if (productInCart) {
        // If the product is in the cart, increment the quantity
        productInCart.quantity += 1;
        console.log('Product already in cart:', productInCart);
      } else {
        // If the product is not in the cart, add it with quantity 1
        cart.items.push({ product: product, quantity: 1 });
        console.log('Product added to cart:', cart.items);
      }

      // Save the updated user data
      await cart.save();

      return res.json({
        success: true,
        message: "Product added to cart",
        cart,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },




  removeFromCart: async function (req, res) {
    try {
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      // console.log("[log] Product ID:", productId);
      // console.log("[log] User ID:", req.user);

      const productObjectId = new mongoose.Types.ObjectId(productId); // Correct ObjectId conversion

      // First, check if the cart exists for the user
      const cart = await cartModel.findOne({ userId: req.user });

      if (!cart) {
        // console.log("[log] Cart not found for user");
        return res.status(404).json({ message: "Cart not found for user" });
      }

      // Check if the product exists in the cart
      const productInCart = cart.items.some(item => {
        if (item.product._id) {
          // console.log("[log] Found productId:", item.product._id);
          return item.product._id.toString() === productObjectId.toString();
        }
        // console.log("[log] Missing productId in cart item:", item);
        return false;
      });

      if (!productInCart) {
        // console.log("[log] Product not found in cart");
        return res.status(404).json({ message: "Product not found in cart" });
      }

      // Remove the product from the cart if it exists
      const result = await cartModel.updateOne(
        { userId: req.user, "items.product._id": productObjectId },
        { $pull: { items: { "product._id": productObjectId } } }
      );

      if (result.modifiedCount === 0) {
        // console.log("[log] No item was removed, possible mismatch");
        return res.status(404).json({ message: "No item was removed" });
      }

      // console.log("[log] Item successfully removed from cart");
      return res.json({ success: true, message: "Item removed from cart" });

    } catch (error) {
      // console.error("[log] Error in removeFromCart:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  clearCart: async function (req, res) {

    try {
      await cartModel.findOneAndDelete({ userId: req.user });
      res.json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  incrementQuantity: async function (req, res) {
    try {
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      // console.log("[log] Product ID:", productId);
      // console.log("[log] User ID:", req.user);

      const productObjectId = new mongoose.Types.ObjectId(productId);

      // Find the user's cart
      const cart = await cartModel.findOne({ userId: req.user });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Check if the product is already in the cart
      const productIndex = cart.items.findIndex(item => item.product._id.toString() === productObjectId.toString());

      if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      // Increment the quantity of the product
      cart.items[productIndex].quantity += 1;

      await cart.save();

      return res.json({ success: true, message: "Product quantity incremented", cart });

    } catch (error) {
      // console.error("[log] Error in incrementQuantity:", error);
      return res.status(500).json({ error: error.message });
    }
  },
  decrementQuantity: async function (req, res) {
    try {
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      // console.log("[log] Product ID:", productId);
      // console.log("[log] User ID:", req.user);

      const productObjectId = new mongoose.Types.ObjectId(productId);

      // Find the user's cart
      const cart = await cartModel.findOne({ userId: req.user });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Check if the product is in the cart
      const productIndex = cart.items.findIndex(item => item.product._id.toString() === productObjectId.toString());

      if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      // Decrement the quantity if it's greater than 1
      if (cart.items[productIndex].quantity > 1) {
        cart.items[productIndex].quantity -= 1;
      } else {
        // If quantity is 1, remove the product from the cart entirely
        cart.items.splice(productIndex, 1);
      }

      await cart.save();

      return res.json({ success: true, message: "Product quantity decremented", cart });

    } catch (error) {
      // console.error("[log] Error in decrementQuantity:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};
module.exports = cartController;
