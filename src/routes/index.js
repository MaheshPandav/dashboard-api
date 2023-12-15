const express = require("express");
const { register, login, getAllUsers, getUserById,updateUserById, deleteUserById } = require("../controller/auth/auth");
const routes = express.Router();

routes.post("/register", register);
routes.post("/login", login);
routes.get("/allUsers", getAllUsers);
routes.get("/userDetail/:id", getUserById);
routes.put("/updateUser/:id", updateUserById);
routes.delete("/deleteUser/:id", deleteUserById);

module.exports = routes;
