const { Schema, model } = require("mongoose");
const productSchema = new Schema({
  // category: {
  //   type: Schema.Types.ObjectId || String,
  //   ref: "Category",
  //   required: [true, "Category is required"],
  // },
  category: { type: String, required: false },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: [{ type: String, required: true }], default: [] },
  selected3dImage: { type: String, required: false },
  name: { type: String, required: [true, "Name is required"] },
  description: { type: String, default: "" },
  // feedbacks: [
  //   {
  //     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  //     rating: { type: Number, required: false, min: 1, max: 5 },
  //     comment: { type: String, required: false },
  //     timestamp: { type: Date, default: Date.now },
  //   },
  // ],
  updatedOn: { type: Date },
  createdOn: { type: Date },
});
productSchema.pre("save", function (next) {
  this.createdOn = new Date();
  this.updatedOn = new Date();
  next();
});
//if using ()=>{} means arrow function then the request will get confuse to recognize function
productSchema.pre(["update", "findOneAndUpdate", "updateOne"], function (next) {
  const update = this.getUpdate();
  this.updatedOn = new Date(); // Update the updatedOn field
  delete update._id;
  next();
});
const productModel = model("Product", productSchema);
module.exports = { productModel, productSchema };
