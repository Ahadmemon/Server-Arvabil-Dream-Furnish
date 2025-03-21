require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoutes = require("./routes/userRoute");
const categoryRoutes = require("./routes/categoryRoute");
const productRoutes = require("./routes/productRoute");
const feedbackRoutes = require("./routes/feedbackRoute");
const cartRoutes = require("./routes/cartRoute");
const orderRoutes = require("./routes/orderRoute");
const listEndpoints = require("express-list-endpoints");
// console.log(listEndpoints(app));
// const { auth } = require("./middlewares/auth");
const app = express();
const PORT = process.env.PORT || 3000;
// const MONGO_URL = process.env.MONGO_URL;
//testing mail: test$count@gmail.com and password: test$count*3, eg: test1@gmail.com, pass: test111
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to databse", err);
  });
// app.use(auth);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);
// app.use("/admin", userRoutes);
app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully!");
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server started at port ${PORT}`)
);
