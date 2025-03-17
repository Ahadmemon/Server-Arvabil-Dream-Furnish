const { Schema, model } = require("mongoose");

const feedbackSchema = new Schema({
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    username: { type: String, required: false },
    userImage: { type: String, required: false },
    feedback: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = model("Feedback", feedbackSchema);