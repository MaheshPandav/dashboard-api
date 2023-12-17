const express = require("express");
const {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  multerUpload,
} = require("../controller/auth");
const { RecentActivity } = require("../controller/recentActivity");
const routes = express.Router();

// Auth
routes.post("/register",multerUpload.single('profileImage'), register);
routes.post("/login", login);
routes.get("/allUsers", getAllUsers);
routes.get("/userDetail/:id", getUserById);
routes.put("/updateUser/:id", updateUserById);
routes.delete("/deleteUser/:id", deleteUserById);

//Others API

routes.get("/recentActivity", RecentActivity);

module.exports = routes;
