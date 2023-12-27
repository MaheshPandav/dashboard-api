const express = require("express");
const {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  multerUpload,
  verifyToken,
  getUserDetails,
} = require("../controller/auth");
const { RecentActivity } = require("../controller/recentActivity");
const { addToWallet, getWallet } = require("../controller/wallet");
const routes = express.Router();

// Auth
routes.post("/register", multerUpload.single("profileImage"), register);
routes.post("/login", login);
routes.get("/allUsers", getAllUsers);
routes.get("/userDetail/:id", getUserById);
routes.put("/updateUser/:id", updateUserById);
routes.delete("/deleteUser/:id", deleteUserById);
routes.get("/user-details", verifyToken, getUserDetails);

//Others API

routes.get("/recentActivity", RecentActivity);
routes.post("/add-to-wallet", verifyToken, addToWallet);
routes.get("/get-wallet", verifyToken, getWallet);

module.exports = routes;
