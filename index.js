require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
require("./config/db");
const app = express();
const port = 8080 || process.env.PORT;
const routes = require("./src/routes");
const cors = require('cors');

const jsonParser = bodyParser.json();
app.use(cors());

app.use(jsonParser);
app.use("/api/v1", routes);

app.get("/", () => {
  console.log("demo app");
});

app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
