const { User } = require("../models/authModal");
const { Event } = require("../models/recentEvent");
const { Wallet } = require("../models/wallet");

const addToWallet = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    let wallet = await Wallet.findOne({ user: userId });
    let user = await User.findOne({ _id: userId });
    console.log(user);
    if (!wallet) {
      wallet = new Wallet({
        user: userId,
        balance: 0,
      });
      await wallet.save();
    }

    const amountToAdd = req.body.amount;

    if (!amountToAdd || isNaN(amountToAdd) || amountToAdd <= 0) {
      return res.status(400).json({ message: "Invalid amount." });
    }
    wallet.balance += amountToAdd;
    await wallet.save();
    const Activity = new Event({
      created_by: userId,
      action: "ADD_WALLET",
      title: `${user.firstName} ${user.lastName} was added ${amountToAdd} Amount in their wallet`,
      ts: Math.floor(new Date().getTime() / 1000),
    });
    await Activity.save();
    res.status(200).json({
      message: `Successfully added ${amountToAdd} to the wallet.`,
      walletBalance: wallet.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getWallet = async (req, res, next) => {
  const userId = req.user.userId;
  try {
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res
        .status(404)
        .json({ message: "Wallet not found for the user." });
    }
    res.status(200).json({
      user: userId,
      walletBalance: wallet.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addToWallet,
  getWallet,
};
