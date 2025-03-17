const { Schema, model } = require("mongoose");
const categorySchema = new Schema({
  name: { type: String, required: [true, "Title is required"] },
  description: { type: String, default: "" },
  image: { type: String, default: [] },
  updatedOn: { type: Date },
  createdOn: { type: Date },
});
categorySchema.pre("save", function (next) {
  this.createdOn = new Date();
  this.updatedOn = new Date();
  next();
});
//if using ()=>{} means arrow function then the request will get confuse to recognize function
categorySchema.pre(
  ["update", "findOneAndUpdate", "updateOne"],
  function (next) {
    const update = this.getUpdate();
    this.updatedOn = new Date(); // Update the updatedOn field
    delete update._id;
    next();
  }
);
const CategoryModel = model("Category", categorySchema);
module.exports = CategoryModel;
