//models/user.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  created_by: String,
  title: String,
  action: String,
  ts: String,
});

const Event = mongoose.model("events", eventSchema);
module.exports.Event = Event;
