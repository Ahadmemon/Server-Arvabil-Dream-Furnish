const userModel = require("../models/userModel");
const orderModel = require("./../models/orderModel");
const razorpay = require("./../services/razorpay");
const mongoose = require("mongoose");

const orderController = {
  createOrder: async function (req, res) {
    try {
      const { items, status } = req.body;
      const userId = req.user;
      let totalAmount = 0;
      items.forEach((item) => {
        totalAmount += item.product.price * item.quantity;
      })
      const razorPayOrder = await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
      });
      const user = await userModel.findById(userId).lean();
      const newOrder = new orderModel({ user: user, items: items, status: status, razorPayOrderId: razorPayOrder.id });
      await newOrder.save();
      return res.json({
        success: true,
        message: "Order created",
        data: newOrder,
      });
    } catch (err) {
      return res.json({ success: false, message: err.message });
    }
  },
  fetchOrdersForUser: async function (req, res) {
    try {
      const userId = req.user; // Assuming req.user contains the userId of the logged-in user
      console.log("Fetching orders for user:", userId);
      // const sampleOrders = await orderModel.find().limit(5);
      // console.log(sampleOrders);
      // Fetch orders based on user._id
      const foundOrders = await orderModel.find({ "user._id": new mongoose.Types.ObjectId(userId) }).populate("user", "name email profilePic"); // Populating user data if needed
      if (foundOrders.length === 0) {
        console.log("No orders found for user:", userId);
      }
      console.log("Found orders:", foundOrders);

      return res.json({
        success: true,
        data: foundOrders,
        message: "Orders found",
      });
    } catch (err) {
      console.log("Error fetching orders:", err.message);
      return res.json({ success: false, message: err.message });
    }
  },
  updateOrder: async function (req, res) {
    try {
      const { orderId, status, razorPayPaymentId, razorPaySignature } = req.body;
      const updatedOrders = await orderModel.findOneAndUpdate(
        { _id: orderId, }, // Match the order and specific item
        { status: status, razorPayPaymentId: razorPayPaymentId, razorPaySignature: razorPaySignature },
        { new: true }
      );
      return res.json({
        success: true,
        data: updatedOrders,
        message: "Orders updated successfully",
      });
    } catch (err) {
      return res.json({ success: false, message: err.message });
    }
  },
};
module.exports = orderController;
