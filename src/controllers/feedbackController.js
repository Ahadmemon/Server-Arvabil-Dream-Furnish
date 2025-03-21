const Feedback = require("../models/feedbackModel");
const userModel = require("../models/userModel");

const feedbackController = {
    submitFeedback: async function (req, res) {
        try {
            const { productId, feedback } = req.body;
            const userId = req.user;
            const user = await userModel.findById(userId);

            // If user doesn't exist, return an error
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Create a new feedback object with the necessary data
            const newFeedback = new Feedback({
                userId,
                productId,
                feedback,
                userImage: user.profileImage,
                username: user.name,  // Assuming you're saving the username as well
            });

            // Save the new feedback to the database
            await newFeedback.save();

            // Respond with success message
            res.status(201).json({ message: "Feedback submitted successfully" });
        } catch (error) {
            // console.error(error);
            res.status(500).json({ error: "Error submitting feedback" });
        }
    },
    getFeedbacksByProductId: async function (req, res) {
        try {
            // Fetch feedbacks and populate the username field
            const feedbacks = await Feedback.find({ productId: req.params.productId })
                // Populating username from User model
                .sort({ timestamp: -1 });

            res.status(200).json(feedbacks);
        } catch (error) {
            res.status(500).json({ error: "Error fetching feedback" });
        }
    },
}
module.exports = feedbackController;