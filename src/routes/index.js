const express = require("express");
const { sendOtp, verifyOtp } = require("../controller/twilio-sms");
const routes = express.Router();

routes.post("/sendOtp", sendOtp);
routes.post("/verifyOtp", verifyOtp);
// routes.get("/allUsers", allUsers);

module.exports = routes;
