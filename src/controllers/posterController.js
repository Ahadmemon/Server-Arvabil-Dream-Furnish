const { posterModel } = require("./../models/posterModel");
// const userModel = require("./../models/userModel");

const posterController = {
    addPoster: async function (req, res) {
        try {
            const posterData = req.body;
            let newPoster = new posterModel(posterData);
            newPoster = await newPoster.save();
            return res.json({
                success: true,
                message: "New Poster created",
                data: newPoster,
            });
        } catch (err) {
            return res.json({ success: false, message: err.message });
        }
    },
    deletePoster: async function (req, res) {
        try {
            const posterId = req.query._id;
            const findPosterIdToDelete = await posterModel.findByIdAndDelete(posterId);
            if (!findPosterIdToDelete) {
                return res.json({ success: false, message: "Poster not found" });
            }
            const posters = await posterModel.find();
            posters.save();
            return res.json({ succes: true, message: "Poster deleted", data: posters });
        } catch (err) {
            return res.json({ success: false, message: err.message });
        }
    },
    adminAuth: async function (req, res) {
        try {
            // await userAuthMiddleware.auth(req, res, next); // Await the auth middleware
            const user = await userModel.findById(req.user);
            // console.log(user);
            return res.json({ ...user._doc, token: req.token });
        } catch (err) {
            // console.error(err);
            return res.status(401).json({ message: "Authentication failed." });
        }
    },
    fetchAllPosters: async function (req, res) {
        try {
            const posters = await posterModel.find();
            return res.json({
                succes: true,
                message: "All poster fetched",
                data: posters,
            });
        } catch (err) {
            return res.json({ success: false, message: err.message });
        }
    },
};
module.exports = posterController;
