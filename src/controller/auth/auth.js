const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  User,
  validate,
  loginValidate,
  editValidate,
} = require("../../models/authModal/authModal");

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
      const salt = await bcrypt.genSalt(10);
      const finalPassword = await bcrypt.hash(password, salt);
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        mobileNumber: mobileNumber,
        email: email,
        password: finalPassword,
      });
      await user.save();
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
      const correctPassword = await bcrypt.compare(
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
  deleteUserById
};
