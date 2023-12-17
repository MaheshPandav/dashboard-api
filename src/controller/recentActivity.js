const { Event } = require("../models/recentEvent");

const RecentActivity = async (req, res, next) => {
  try {
    const RecentActivity = await Event.find();
    res.status(200).json(RecentActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

module.exports = {
  RecentActivity,
};
