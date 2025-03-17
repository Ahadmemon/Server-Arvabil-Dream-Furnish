const feedbackRoutes = require("express").Router();
const feedbackController = require("./../controllers/feedbackController");

const { auth } = require("../middlewares/auth");

feedbackRoutes.post("/submitFeedback", auth, feedbackController.submitFeedback);
feedbackRoutes.get("/:productId/getFeedbacks", feedbackController.getFeedbacksByProductId);

module.exports = feedbackRoutes;
