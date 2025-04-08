const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const admin_auth = async (req, res, next) => {
    // console.log("Reached to middleware");

    try {

        const token = req.header("x-auth-token");
        if (!token) {
            return res.status(401).json({ message: "No auth token, access denied." });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res
                .status(401)
                .json({ message: "Token verification failed, access denied." });
        }
        const user = await User.findById(verified.id);
        if (user.role !== "admin") {
            return res.status(401).json({ message: "You are not authorized to access this route." });
        }
        req.user = verified.id;
        req.token = token;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token, access denied." });
    }
};

module.exports = { admin_auth };
