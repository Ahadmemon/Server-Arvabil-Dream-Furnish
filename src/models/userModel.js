const { Schema, model } = require("mongoose");
const { productSchema } = require("./productModel");
// const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: { type: String, required: false, default: "" },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: (value) =>
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value),
      message: "Enter valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    default: "",
    validate: {
      validator: (value) => value.length >= 6,
      message: "Please enter a longer password",
    },
  },
  profileImage: { type: String, required: false, default: "" },
  // cart: [{ product: productSchema, quantity: { type: Number, required: true } }],
  phone: { type: String, required: false, default: "", trim: true },
  address: { type: String, required: false, default: "", trim: true },
  // city: { type: String, required: false, default: "", trim: true },
  // country: { type: String, required: false, default: "", trim: true },
  // state: { type: String, required: false, default: "", trim: true },
  role: { type: String, required: false, default: "user", trim: true },
  // token: { type: String, required: false, default: "", trim: true },
  updatedOn: { type: Date },
  createdOn: { type: Date },
});

// **🔥 Hash password before saving new users **
userSchema.pre("save", function (next) {
  // if (this.isNew || this.isModified("password")) {
  //   this.password = bcrypt.hashSync(this.password, 10);
  // }
  this.createdOn = this.createdOn || new Date();
  this.updatedOn = new Date();
  next();
});

// **🔥 Ensure `updatedOn` is updated on user updates**
userSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
  let update = this.getUpdate();
  update.updatedOn = new Date(); // ✅ Correct way to update timestamp
  // if (update.password) {
  //   update.password = bcrypt.hashSync(update.password, 10); // ✅ Hash new password if changed
  // }
  this.setUpdate(update);
  next();
});

const UserModel = model("User", userSchema);
module.exports = UserModel;
