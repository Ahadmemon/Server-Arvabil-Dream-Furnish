const { productModel } = require("./../models/productModel");
// const userModel = require("./../models/userModel");

const productController = {
  addProduct: async function (req, res) {
    try {
      const productData = req.body;
      let newProduct = new productModel(productData);
      newProduct = await newProduct.save();
      return res.json({
        success: true,
        message: "New Product Created",
        data: newProduct,
      });
    } catch (err) {
      return res.json({ success: false, message: err.message });
    }
  },
  deleteProduct: async function (req, res) {
    try {
      const { _id } = req.params;
      const findProductIdToDelete = await productModel.findByIdAndDelete(_id);
      if (!findProductIdToDelete) {
        return res.json({ success: false, message: "Product not found" });
      }
      const products = await productModel.find();
      products.save();
      return res.json({ succes: true, message: "Product deleted", data: products });

    } catch (err) {
      return res.json({ success: false, message: err.message });
    }
  },
  // adminAuth: async function (req, res) {
  //   try {
  //     // await userAuthMiddleware.auth(req, res, next); // Await the auth middleware
  //     const user = await userModel.findById(req.user);
  //     console.log(user);
  //     return res.json({ ...user._doc, token: req.token });
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(401).json({ message: "Authentication failed." });
  //   }
  // },
  fetchAllProducts: async function (req, res) {
    try {
      const products = await productModel.find();
      return res.json({
        succes: true,
        message: "All products fetched",
        data: products,
      });
    } catch (err) {
      return res.json({ success: false, message: err.message });
    }
  },
  fetchRandomProductPerCategory: async function (req, res) {
  try {
    const products = await productModel.aggregate([
      {
        $group: {
          _id: "$category", // group by category
          products: { $push: "$$ROOT" } // store all products in that category
        }
      },
      {
        $project: {
          category: "$_id",
          _id: 0,
          product: {
            $arrayElemAt: [
              "$products",
              { $floor: { $multiply: [{ $rand: {} }, { $size: "$products" }] } }
            ]
          }
        }
      }
    ]);

    return res.json({
      success: true,
      message: "One random product per category fetched",
      data: products,
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
},
  addFeedback: async function (req, res) {
    try {
      const { productId } = req.params;
      const { comment } = req.body;
      const userId = req.user; // Extract user ID from token

      const product = await productModel.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      // Add feedback
      product.feedbacks.push({ userId, comment });
      await product.save();

      res.json({ message: "Feedback added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  fetchProductsByCategory: async function (req, res) {
    try {
      const category = req.query.category;
      const foundProductByCategoryId = await productModel.find({
        category: category,
      });
      if (!foundProductByCategoryId) {
        return res.json({ success: false, message: "Product not found" });
      }
      return res.json({
        succes: true,
        message: "Product fetched by category id",
        data: foundProductByCategoryId,
      });
    } catch (err) {
      return res.json({ success: false, message: err.message });
    }
  },
};
module.exports = productController;








// const express = require('express');
// const Feedback = require('../models/feedback');
// const authenticateToken = require('../middleware/authenticateToken'); // Authentication middleware

// const router = express.Router();

// // Submit Feedback for a specific product
// router.post('/submit', authenticateToken, async (req, res) => {
//   try {
//     const { productId, feedbackText } = req.body;
//     const { userId } = req.user;  // Get userId from the authenticated user

//     const newFeedback = new Feedback({
//       userId,
//       productId,
//       feedbackText,
//     });
//     await newFeedback.save();
//     res.status(200).json({ message: 'Feedback submitted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error submitting feedback', error });
//   }
// });

// // Get Feedbacks for a specific product
// router.get('/fetch/:productId', async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const feedbacks = await Feedback.find({ productId }).sort({ timestamp: -1 });
//     res.status(200).json(feedbacks);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching feedback', error });
//   }
// });

// module.exports = router;