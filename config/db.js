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
