const userRoutes = require("express").Router();
const userController = require("../controllers/userController");
const { auth } = require("../middlewares/auth");

userRoutes.post("/signUp", userController.signUp);
userRoutes.post("/signIn", userController.signIn);
userRoutes.post("/updatePassword", userController.updatePassword);
userRoutes.get("/fetchAllUsers", userController.fetchAllUsers);
userRoutes.post("/editUser", auth, userController.editUser);

userRoutes.use(auth);
userRoutes.post("/isTokenValid", userController.isTokenValid);
userRoutes.get("/", auth, userController.userAuth); // just directly call auth middleware with await in userController.auth

// console.log(auth); // Should show an object with the `auth` function

// Apply auth middleware for the GET route to protect it
module.exports = userRoutes;

