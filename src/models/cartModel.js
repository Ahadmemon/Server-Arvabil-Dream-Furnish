const { Schema, model } = require("mongoose");
const { productSchema } = require("./productModel");


const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: productSchema,
      quantity: { type: Number, default: 1 }
    }
  ]
});


// const cartItemSchema = new Schema({
//   item: { type: Schema.Types.ObjectId, ref: "Product" },
//   quantity: { type: Number, default: 1 },
// });
// const cartSchema = new Schema({
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   items: { type: [cartItemSchema], default: [] },
//   updatedOn: { type: Date },
//   createdOn: { type: Date },
// },
//   { timestamps: true },);
cartSchema.pre("save", function (next) {
  this.createdOn = new Date();
  this.updatedOn = new Date();
  next();
});
//if using ()=>{} means arrow function then the request will get confuse to recognize function
cartSchema.pre(["update", "findOneAndUpdate", "updateOne"], function (next) {
  const update = this.getUpdate();
  this.updatedOn = new Date(); // Update the updatedOn field
  delete update._id;
  next();
});
const CartModel = model("Cart", cartSchema);
module.exports = CartModel;
