const express = require("express");
const { sendOTP, verifyOTP } = require("../controller/twilio-sms");
const routes = express.Router();

routes.post("/send-otp", sendOTP);
routes.post("/verify-otp", verifyOTP);


module.exports = routes