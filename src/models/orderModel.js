const { Schema, model } = require("mongoose");
const { productSchema } = require("./productModel");
const orderItemSchema = new Schema({

  product: { type: productSchema, required: true },
  quantity: { type: Number, default: 1 },
});
const orderSchema = new Schema({
  user: {
    type: Schema.Types.Mixed,
    ref: "User",
    required: true,
  },

  items: { type: [orderItemSchema], default: [] },
  razorPayOrderId: { type: String },
  razorPayPaymentId: { type: String },
  razorPaySignature: { type: String },
  status: { type: String, default: "Pending" },
  updatedOn: { type: Date },
  createdOn: { type: Date },
});
orderSchema.pre("save", function (next) {
  this.createdOn = new Date();
  this.updatedOn = new Date();
  next();
});
//if using ()=>{} means arrow function then the request will get confuse to recognize function
orderSchema.pre(["update", "findOneAndUpdate", "updateOne"], function (next) {
  const update = this.getUpdate();
  this.updatedOn = new Date(); // Update the updatedOn field
  delete update._id;
  next();
});
const orderModel = model("Order", orderSchema);
module.exports = orderModel;
