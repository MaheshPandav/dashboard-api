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
const sendOTP = async (request, response, next) => {
  const { phoneNumber } = request.body;
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

    response
      .status(200)
      .send(
        "User registered successfully. Check your phone for the verification code."
      );
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
};

const verifyOTP = async (request, response, next) => {
  const { phoneNumber, verificationCode } = request.body;
  try {
    const user = await User.findOne({ phoneNumber, verificationCode });
    if (!user) {
      return response.status(400).send("Invalid verification code.");
    }
    const newUser = new AllUser({
      phoneNumber: user.phoneNumber,
    });
    await newUser.save();
    response
      .status(200)
      .send(
        "Phone number verified successfully. User saved in allUser collection."
      );
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};
