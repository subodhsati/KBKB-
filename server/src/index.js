const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const initialiseDB = require("./modules/initialiseDB");

const root = require("./routes/root");

const appConfig = require("./config/appConfig");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

(async () => {
  initialiseDB();
})();

app.use("/", root);

app.listen(appConfig.port, () => {
  console.log("API running on port", appConfig.port);
});