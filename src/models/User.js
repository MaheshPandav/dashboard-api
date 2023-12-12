const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: String,
  otp: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;