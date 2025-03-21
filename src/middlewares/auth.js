const jwt = require("jsonwebtoken");
const userModel = require("./../models/userModel");

const auth = async (req, res, next) => {
  // console.log("Reached to middleware");

  try {
    // Retrieve the token from request header
    const token = req.header("x-auth-token");
    // console.log("Token from request header:", token);
    if (!token) {
      // console.log("No token, access denied");
      return res.status(401).json({ message: "No auth token, access denied." });
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log('Decoded Token:', verified);

    if (!verified) {
      // console.log("Token verification failed");
      return res.status(401).json({ message: "Token verification failed, access denied." });
    }

    // Retrieve user from database using the verified ID
    const user = await userModel.findById(verified.id);
    // console.log(user);
    if (!user) {
      // console.log("User not found");
      return res.status(401).json({ message: "User not found, access denied." });
    }

    ;
    // Optional: Check if the token in the database matches the token provided


    // Attach user info to request for downstream usage
    req.user = verified.id; // Attach user ID
    req.token = token;      // Attach token to request

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    // console.log("JWT Error:", error.message);
    return res.status(401).json({ message: "Invalid token, access denied." });
  }
};

module.exports = { auth };


