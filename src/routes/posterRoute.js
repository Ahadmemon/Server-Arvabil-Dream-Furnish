const posterRoutes = require("express").Router();
// const { admin_auth } = require("./../middlewares/admin_auth");
const posterController = require("./../controllers/posterController");
posterRoutes.post("/addPoster", posterController.addPoster);
posterRoutes.delete("/deletePoster", posterController.deletePoster);
posterRoutes.get("/fetchAllPosters", posterController.fetchAllPosters);


module.exports = productRoutes;
