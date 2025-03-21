const userModel = require("./../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { productModel } = require("./../models/productModel");
const e = require("express");

require("dotenv").config();

// const userAuthMiddleware = require("../middlewares/auth");

// const UserModel = require("./../models/userModel");
const userController = {
  signUp: async function (req, res) {
    try {
      const userData = req.body;
      userData.role = userData.role || 'user';
      const existingUser = await userModel.findOne({ email: userData.email, })
      if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }
      const hashedPassword = bcrypt.hashSync(userData.password, 10);
      userData.password = hashedPassword;
      // console.log("User data:", userData)
      let newUser = new userModel(userData);
      await newUser.save();
      // console.log('New User', newUser);
      if (!newUser._id) {
        return res.status(500).json({ success: false, message: "Failed to create user. No ID found." });
      }

      token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
      // newUser.token = token;
      // console.log("--------Token-------", token);


      // Return the token along with user data in a single response
      // return res.status(200).json({ token, user: foundUser, success: true, message: "User logged in" });

      // await newUser.save();
      return res.json({
        success: true,
        message: "New user created",
        token: token,
        data: newUser,
      });
    } catch (err) {
      return res.json({ success: false, message: err.message });
    }
  },
  signIn: async function (req, res) {
    try {
      const userData = req.body;
      const foundUser = await userModel.findOne({ email: userData.email });


      if (!foundUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      // console.log('Found User:', foundUser);
      const isValidPwd = bcrypt.compareSync(userData.password, foundUser.password);

      // console.log('Password match:', isValidPwd);
      // console.log('User:', foundUser);
      if (!isValidPwd) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid password" });
      }
      // const token = jwt.sign({ id: foundUser._id, role: foundUser.role }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
      const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

      // Update the user's token in the database
      // foundUser.token = token;
      // await foundUser.save();
      // console.log("--------Token-------", token);

      return res.status(200).json({ token: token, user: foundUser, success: true, message: "User logged in" });

    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  userAuth: async function (req, res) {
    try {
      // await userAuthMiddleware.auth(req, res, next); // Await the auth middleware
      // console.log("Reached to userController middleware");
      const user = await userModel.findById(req.user);
      // console.log(user);
      return res.json({ user: user, token: req.token });
    } catch (err) {
      // console.error(err);
      return res.status(401).json({ message: "Authentication failed." });
    }
  },

  isTokenValid: async function (req, res) {
    try {
      // You may not need to verify the token in this function if it's already handled by middleware
      const token = req.header("x-auth-token");
      if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
      }

      // The middleware should have verified the token already, so just check that
      const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (!verified) {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }

      const foundUser = await userModel.findById(verified.id);
      if (!foundUser) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, message: "Token is valid" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  updatePassword: async function (req, res) {
    try {
      const { password, _id } = req.body;
      const user
        = await userModel.findById(_id);
      if (user) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        return res.json({ success: true, message: "Password updated" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: error.message });

    }
  },
  editUser: async function (req, res) {
    try {
      const { email, name, password, address, profileImage, phone } = req.body;

      // Create an object to hold the fields that need to be updated
      const datatoUpdate = {};

      // Conditionally add each field to the datatoUpdate object if it's not empty
      if (email) datatoUpdate.email = email;
      if (name) datatoUpdate.name = name;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        datatoUpdate.password = await bcrypt.hash(password, salt);
      }
      if (address) datatoUpdate.address = address;
      if (profileImage) datatoUpdate.profileImage = profileImage;
      if (phone) datatoUpdate.phone = phone;

      // Find the user by ID
      const foundUser = await userModel.findById(req.user);
      if (!foundUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Update the user with the provided fields (only the ones that are not empty)
      const updateUser = await userModel.findByIdAndUpdate(req.user, datatoUpdate, { new: true });

      // Return the updated user data
      return res.json({
        success: true,
        message: "User updated",
        data: updateUser
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  fetchAllUsers: async function (req, res) {
    try {
      const foundUsers = await userModel.find({});
      return res.json({
        success: true,
        data: foundUsers,
        message: "Users found",
      });
    } catch (err) {
      // console.log("Error fetching users:", err.message);
      return res.json({ success: false, message: err.message });
    }
  },

  // admin_auth: async function (req, res) {
  //   try {
  //     // await userAuthMiddleware.auth(req, res, next); // Await the auth middleware
  //     const user = await userModel.findById(req.user);
  //     console.log(user);
  //     if (user.role != 'admin') {
  //       return res.status(403).json({ message: "Access denied. Admins only." });
  //     }
  //     return res.json({ ...user._doc, token: req.token });
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(401).json({ message: "Authentication failed." });
  //   }
  // },
};
module.exports = userController;
