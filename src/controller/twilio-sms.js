const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function generateToken(user) {
  return jwt.sign(
    { phoneNumber: user.phoneNumber },
    process.env.JWT_SECRETE_KEY,
    { expiresIn: "1h" }
  );
}
const sendOtp = async (req, res, next) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const user = new User({ phoneNumber, otp });
    await user.save();
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: "+12018347166",
      to: phoneNumber,
    });
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyOtp = async (req, res, next) => {
  const { phoneNumber, otp } = req.body;
  try {
    const user = await User.findOne({ phoneNumber, otp });
    if (user) {
      const token = generateToken(user);
      await User.findOneAndUpdate({ phoneNumber }, { $unset: { otp: 1 } });

      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
