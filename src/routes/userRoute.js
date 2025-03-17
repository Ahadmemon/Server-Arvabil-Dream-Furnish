const userRoutes = require("express").Router();
const userController = require("../controllers/userController");
const { auth } = require("../middlewares/auth");

userRoutes.post("/signUp", userController.signUp);
userRoutes.post("/signIn", userController.signIn);
userRoutes.post("/editUser", auth, userController.editUser);
// userRoutes.post("/addToCart", auth, userController.addToCart);
userRoutes.use(auth);
userRoutes.post("/isTokenValid", userController.isTokenValid);
userRoutes.get("/", auth, userController.userAuth); // just directly call auth middleware with await in userController.auth

console.log(auth); // Should show an object with the `auth` function

// Apply auth middleware for the GET route to protect it
module.exports = userRoutes;


// const userRoutes = require("express").Router();
// const userController = require("./../controllers/userController");
// const authMiddleware = require("./../middlewares/auth");
// // const { admin_auth } = require("./../middlewares/admin_auth");

// userRoutes.post("/signUp", userController.signUp);
// userRoutes.post("/signIn", userController.signIn);
// userRoutes.post("/isTokenValid", authMiddleware.auth, userController.isTokenValid);
// userRoutes.get("/", authMiddleware.auth, userController.userAuth); // just directly call auth middleware with await in userController.auth
// console.log(authMiddleware.auth);
// console.log("Middleware attached to routes:", userRoutes.stack.map(r => r.route?.path));
// // console.log(admin_auth);

// // userRoutes.get("/admin", admin_auth, userController.admin_auth); // just directly call auth middleware with await in userController.auth

// // Apply auth middleware for the GET route to protect it
// // userRoutes.get("/", userAuthMiddleware, userController.auth); // just directly call auth middleware with await in userController.auth
// // userRoutes.get("/", adminAuthMiddleware, userController.admin_auth); // just directly call auth middleware with await in userController.auth
// module.exports = userRoutes;
