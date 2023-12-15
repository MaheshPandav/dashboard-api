//models/user.js
const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
  lastName: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
  mobileNumber: {
    type: String,
    required: true,
    min: 10,
    max: 12,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 5,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 100,
  },
  confirmPassword: {
    type: String,
    required: false,
    min: 8,
    max: 100,
  },
});

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(100).required(),
    lastName: Joi.string().min(3).max(100).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(100).required(),
    confirmPassword: Joi.string().min(8).max(100).required(),
    mobileNumber: Joi.string().min(10).max(12).required(),
  });
  return schema.validate(user);
}

function loginValidator(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(100).required(),
  });
  return schema.validate(user);
}

function validateEditUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(100),
    lastName: Joi.string().min(3).max(100),
    mobileNumber: Joi.string().min(10).max(12),
  });
  return schema.validate(user);
}
const User = mongoose.model("Users", userSchema);
module.exports.validate = validateUser;
module.exports.loginValidate = loginValidator;
module.exports.editValidate = validateEditUser;
module.exports.User = User;
