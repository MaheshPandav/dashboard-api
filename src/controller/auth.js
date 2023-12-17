const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  User,
  validate,
  loginValidate,
  editValidate,
} = require("../models/authModal");
const { Event } = require("../models/recentEvent");

const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: 'dnmmylkit',
  api_key: '694744911512192',
  api_secret: 'M3EZ1rJy9VEOm3KlsmM-v1v0gwo'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user-profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  }
});

const multerUpload = multer({ storage: storage });

const register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    password,
    confirmPassword,
  } = req.body;
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let user = await User.findOne({ email: email });
  if (user) {
    return res.status(400).send("User already exists. Please sign in");
  } else if (password !== confirmPassword) {
    return res.status(400).send("Password and confirmPassword are not match");
  } else {
    try {
      let profileImageUrl = null;
      if (req.body.profileImage) {
        const result = await cloudinary.uploader.upload(req.body.profileImage);
        profileImageUrl = result.secure_url;
      }

      const salt = await bcryptjs.genSalt(10);
      const finalPassword = await bcryptjs.hash(password, salt);
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        mobileNumber: mobileNumber,
        email: email,
        password: finalPassword,
        profileImage: profileImageUrl,
        created_at: Math.floor(new Date().getTime() / 1000),
      });
      await user.save();
      const Activity = new Event({
        created_by: user._id,
        action: "REGISTER",
        title: `New User Name ${user.firstName} ${user.lastName} is register`,
        ts: Math.floor(new Date().getTime() / 1000),
      });
      await Activity.save();
      return res
        .status(201)
        .json({ message: "User successfully register!", user: user });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
};

const login = async (req, res, next) => {
  const { error } = loginValidate(req.body);
  if (error) {
    return res.status(401).send(error.details[0].message);
  } else {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Incorrect email or password." });
      }
      const correctPassword = await bcryptjs.compare(
        req.body.password,
        user.password
      );
      if (!correctPassword) {
        return res
          .status(400)
          .json({ message: "Incorrect email or password." });
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRETE_KEY,
        { expiresIn: "24h" }
      );
      const Activity = new Event({
        created_by: user._id,
        action: "LOGIN",
        title: `${user.firstName} ${user.lastName} is Log in`,
        ts: Math.floor(new Date().getTime() / 1000),
      });
      await Activity.save();
      res.json({ message: "Successfully logged in", toke: token });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateUserById = async (req, res, next) => {
  const { error } = editValidate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const userId = req.params.id;
  const updateFields = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    Object.assign(user, updateFields);
    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUserById = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  multerUpload
};
