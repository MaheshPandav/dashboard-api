const twilio = require("twilio");

const mongoose = require("mongoose");
const url = process.env.MONGO_URL;

mongoose
  .connect(url)
  .then(() => {
    console.log("Mongo Db connected");
  })
  .catch((error) => {
    console.log("error while connecting mongodb", error);
  });

const User = mongoose.model("User", {
  phoneNumber: String,
  verificationCode: String,
});

const AllUser = mongoose.model("AllUser", {
  phoneNumber: String,
});

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const sendOTP = async (req, res, next) => {
  const { phoneNumber } = req.body;
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  try {
    const user = new User({ phoneNumber, verificationCode });
    await user.save();

    await client.messages.create({
      body: `Your verification code is: ${verificationCode}`,
      from: "+12018347166",
      to: phoneNumber,
    });

    res
      .status(200)
      .send(
        "User registered successfully. Check your phone for the verification code."
      );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const verifyOTP = async (req, res, next) => {
  const { phoneNumber, verificationCode } = req.body;
  try {
    const user = await User.findOne({ phoneNumber, verificationCode });
    if (!user) {
      return res.status(400).send("Invalid verification code.");
    }
    const newUser = new AllUser({
      phoneNumber: user.phoneNumber,
    });
    await newUser.save();
    res
      .status(200)
      .send(
        "Phone number verified successfully. User saved in allUser collection."
      );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};
