const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = { Wallet };
