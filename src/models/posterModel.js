const { Schema, model } = require("mongoose");
const posterSchema = new Schema({

    // category: { type: String, required: false },
    // quantity: { type: Number, required: false },
    image: { type: [{ type: String, required: true }], default: [] },
    name: { type: String, required: false },
    description: { type: String, default: "" },
    updatedOn: { type: Date },
    createdOn: { type: Date },
});
posterSchema.pre("save", function (next) {
    this.createdOn = new Date();
    this.updatedOn = new Date();
    next();
});
//if using ()=>{} means arrow function then the request will get confuse to recognize function
posterSchema.pre(["update", "findOneAndUpdate", "updateOne"], function (next) {
    const update = this.getUpdate();
    this.updatedOn = new Date(); // Update the updatedOn field
    delete update._id;
    next();
});
const posterModel = model("Poster", posterSchema);
module.exports = productModel;
